"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserDto_1 = require("./Dtos/UserDto");
const UserResponseDto_1 = require("./Dtos/Responses/UserResponseDto");
const AuthResponseDto_1 = require("./Dtos/Responses/AuthResponseDto");
const bcrypt = require('bcryptjs');
// Injeção de dependência da UserDao (vamos passar para interface)
class AuthService {
    constructor(userDao, refreshTokensDao) {
        this.userDao = userDao;
        this.refreshTokensDao = refreshTokensDao;
    }
    // AuthLogin: Recebe { email, password }; Retorna { token, refresh }
    // AuthRefresh: Recebe { refresh }; Retorna { token }
    // AuthLogout: Recebe { nada };  Retorna { nada } --> Apenas anula o refresh token no banco (vamos ter q add essa tabela)
    // AuthMe: Recebe { nada }; Retorna { id, email }
    // Retorna um UserDto conforme email inserido
    async getLoginTeste(email) {
        var userEntity = await this.userDao.getUserByEmail(email);
        return new UserDto_1.UserDto(userEntity.id, userEntity.email, userEntity.password, userEntity.role);
    }
    async login(email, password) {
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
        const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '7d' });
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokensDao.create(user.id, refreshToken, refreshExpiresAt);
        return new AuthResponseDto_1.AuthResponseDto(accessToken, refreshToken);
    }
    async refresh(refresh) {
        if (!refresh) {
            throw new Error('Refresh token é obrigatório');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(refresh, jwtSecret); // as { sub: number; email: string; role: string };
        }
        catch (error) {
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
        const accessToken = jsonwebtoken_1.default.sign({ sub: payload.sub, email: payload.email, role: payload.role }, jwtSecret, { expiresIn: '15m' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ sub: payload.sub, email: payload.email, role: payload.role }, jwtSecret, { expiresIn: '7d' });
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokensDao.create(Number(storedToken.user_id), newRefreshToken, refreshExpiresAt);
        return new AuthResponseDto_1.AuthResponseDto(accessToken, newRefreshToken);
    }
    async logout(refresh) {
        if (!refresh) {
            throw new Error('Refresh token é obrigatório');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }
        try {
            jsonwebtoken_1.default.verify(refresh, jwtSecret);
        }
        catch (error) {
            throw new Error('Refresh token inválido');
        }
        const storedToken = await this.refreshTokensDao.findByToken(refresh);
        if (!storedToken) {
            throw new Error('Refresh token não encontrado');
        }
        return await this.refreshTokensDao.deleteByToken(refresh);
    }
    async me(accessToken) {
        if (!accessToken) {
            throw new Error('Access token é obrigatório');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado');
        }
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(accessToken, jwtSecret);
        }
        catch (error) {
            throw new Error('Access token inválido ou expirado');
        }
        const user = await this.userDao.getUserById(payload.sub.toString());
        return new UserResponseDto_1.UserResponseDto(user.id, user.email);
    }
    async cadastro(postDto) {
        postDto.password = await bcrypt.hash(postDto.password, 10);
        var resultado = await this.userDao.post(postDto);
        return resultado;
    }
}
exports.AuthService = AuthService;
