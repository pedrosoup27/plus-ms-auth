import jwt from 'jsonwebtoken';
import { UserDao } from '../dados/UserDao';
import { AuthServiceInterface } from './interfaces/AuthServiceInterface';
import { UserDto } from './Dtos/UserDto';
import { UserEntity } from '../dados/entities/UserEntity';
import { UserResponseDto } from './Dtos/Responses/UserResponseDto';
import { AuthResponseDto } from './Dtos/Responses/AuthResponseDto';
import { UserPostRequestDto } from './Dtos/Requests/UserPostRequestDto';
import { RefreshTokensDaoInterface } from '../dados/interfaces/RefreshTokensDaoInterface';
import { UserDaoInterface } from '../dados/interfaces/UserDaoInterface';
const bcrypt = require('bcryptjs');

// Injeção de dependência da UserDao (vamos passar para interface)
export class AuthService implements AuthServiceInterface{
    constructor(userDao: UserDaoInterface, refreshTokensDao: RefreshTokensDaoInterface){
        this.userDao = userDao;
        this.refreshTokensDao = refreshTokensDao;
    }

    userDao: UserDaoInterface;
    refreshTokensDao: RefreshTokensDaoInterface;

    // AuthLogin: Recebe { email, password }; Retorna { token, refresh }
    // AuthRefresh: Recebe { refresh }; Retorna { token }
    // AuthLogout: Recebe { nada };  Retorna { nada } --> Apenas anula o refresh token no banco (vamos ter q add essa tabela)
    // AuthMe: Recebe { nada }; Retorna { id, email }

    // Retorna um UserDto conforme email inserido
    async getLoginTeste(email: string): Promise<UserDto>{
        var userEntity: UserEntity = await this.userDao.getUserByEmail(email);

        return new UserDto(userEntity.id, userEntity.email, userEntity.password, userEntity.role);
    }

    async login(email: string, password: string): Promise<AuthResponseDto>{
        if (!email || !password) {
            throw new Error('Email e senha são obrigatórios');
        }

        const user = await this.userDao.getUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Email ou senha inválidos');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }

        const accessToken = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokensDao.create(user.id, refreshToken, refreshExpiresAt);

        return new AuthResponseDto(accessToken, refreshToken);
    }

    async refresh(refresh: string): Promise<AuthResponseDto>{
        if (!refresh) {
            throw new Error('Refresh token é obrigatório');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }

        let payload: any;
        try {
            payload = jwt.verify(refresh, jwtSecret);// as { sub: number; email: string; role: string };
        } catch (error) {
            throw new Error('Refresh token inválido ou expirado');
        }

        const storedToken = await this.refreshTokensDao.findByToken(refresh);
        if (!storedToken) {
            throw new Error('Refresh token não encontrado');
        }

        const tokenExpiresAt = new Date(storedToken.expires_at);
        if (tokenExpiresAt.getTime() <= Date.now()) {
            throw new Error('Refresh token expirado');
        }

        await this.refreshTokensDao.deleteByToken(refresh);

        const accessToken = jwt.sign(
            { sub: payload.sub, email: payload.email, role: payload.role },
            jwtSecret,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { sub: payload.sub, email: payload.email, role: payload.role },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokensDao.create(Number(storedToken.user_id), newRefreshToken, refreshExpiresAt);

        return new AuthResponseDto(accessToken, newRefreshToken);
    }
    
    async logout(refresh: string): Promise<boolean>{
        if (!refresh) {
            throw new Error('Refresh token é obrigatório');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }

        try {
            jwt.verify(refresh, jwtSecret);
        } catch (error) {
            throw new Error('Refresh token inválido');
        }

        const storedToken = await this.refreshTokensDao.findByToken(refresh);
        if (!storedToken) {
            throw new Error('Refresh token não encontrado');
        }

        return await this.refreshTokensDao.deleteByToken(refresh);
    }
    
    async me(accessToken: string): Promise<UserResponseDto>{
        if (!accessToken) {
            throw new Error('Access token é obrigatório');
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }

        let payload: any;
        try {
            payload = jwt.verify(accessToken, jwtSecret) as unknown as { sub: number; email: string; role: string };
        } catch (error) {
            throw new Error('Access token inválido ou expirado');
        }

        const user = await this.userDao.getUserById(payload.sub.toString());
        return new UserResponseDto(user.id, user.email);
    }

    async cadastro(postDto: UserPostRequestDto): Promise<boolean>{
        postDto.password = await bcrypt.hash(postDto.password, 10);

        var resultado = await this.userDao.post(postDto);

        return resultado;
    }
}
