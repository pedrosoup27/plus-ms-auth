import { resourceUsage } from 'node:process';
import { UserDao } from '../infraestrutura/UserDao';
import { AuthServiceInterface } from './AuthServiceInterface';
import { UserDto } from './Dtos/UserDto';
import { UserEntity } from '../infraestrutura/entities/UserEntity';
import { UserResponseDto } from './Dtos/Responses/UserResponseDto';
import { AuthResponseDto } from './Dtos/Responses/AuthResponseDto';
import { UserPostRequestDto } from './Dtos/Requests/UserPostRequestDto';
const bcrypt = require('bcryptjs');
// import * as bcrypt from 'bcryptjs';

// Injeção de dependência da UserDao (vamos passar para interface)
export class AuthService implements AuthServiceInterface{
    constructor(userDao: UserDao){
        this.userDao = userDao;
    }

    userDao: UserDao;

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
        if (!email || !password){
            // return res.status(400).json({ error: "email e password são obrigatórios" });
        }

        // Chamada para camada de infra
        var userDto: UserDto = await this.userDao.getUserByEmail(email);

        var token = "isso não é um token";
        var refresh = "isso não é um refresh";

        return new AuthResponseDto(token, refresh);
    }

    async refresh(): Promise<AuthResponseDto>{
        throw new Error("Método não implementado");
        // return new UserResponseDto(1, "Mensagem");
    }
    
    async logout(): Promise<boolean>{
        throw new Error("Método não implementado");
    }
    
    async me(): Promise<UserResponseDto>{
        throw new Error("Método não implementado");
    }

    async cadastro(postDto: UserPostRequestDto): Promise<boolean>{
        postDto.password = await bcrypt.hash(postDto.password, 10);

        var resultado = await this.userDao.post(postDto);

        return resultado;
    }
}
