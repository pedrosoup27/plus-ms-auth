import { resourceUsage } from 'node:process';
import { UserDao } from '../infraestrutura/UserDao';
import { AuthServiceInterface } from './AuthServiceInterface';
import { UserDto } from './Dtos/UserDto';
import { UserEntity } from './Dtos/UserEntity';
import { UserResponseDto } from './Dtos/UserResponseDto';
import { NOTIMP } from 'node:dns';

// Injeção de dependência da UserDao (vamos passar para interface)
export class AuthService implements AuthServiceInterface{
    constructor(userDao: UserDao){
        this.userDao = userDao;
    }

    userDao: UserDao;

    async login(email: string, password: string): Promise<UserDto>{
        if (!email || !password){
            // return res.status(400).json({ error: "email e password são obrigatórios" });
        }

        // Chamada para camada de infra
        var userDto: UserDto = await this.userDao.getUserByEmail(email);

        return userDto;
    }

    // Retorna um UserDto conforme email inserido
    async getLoginTeste(email: string): Promise<UserDto>{
        var userEntity: UserEntity = await this.userDao.getUserByEmail(email);

        return new UserDto(userEntity.id, userEntity.email, userEntity.password, userEntity.role);
    }

    async refresh(): Promise<UserResponseDto>{
        throw new Error("Método não implementado");
        // return new UserResponseDto(1, "Mensagem");
    }
    
    async logout(): Promise<UserResponseDto>{
        throw new Error("Método não implementado");
    }
    
    async me(): Promise<UserDto>{
        throw new Error("Método não implementado");
    }
}
