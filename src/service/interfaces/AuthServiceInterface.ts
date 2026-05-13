import { UserDao } from '../../dados/UserDao';
import { UserDto } from '../Dtos/UserDto';
import { UserResponseDto } from '../Dtos/Responses/UserResponseDto';
import { AuthResponseDto } from '../Dtos/Responses/AuthResponseDto';
import { UserEntity } from '../../dados/entities/UserEntity';
import { UserPostRequestDto } from '../Dtos/Requests/UserPostRequestDto';
import { UserDaoInterface } from '../../dados/interfaces/UserDaoInterface';

export interface AuthServiceInterface{
    userDao: UserDaoInterface;

    // Método para teste dos endpoints
    getLoginTeste(email: string): Promise<UserDto>;

    // AuthLogin: Recebe { email, password }; Retorna { token, refresh }
    // AuthRefresh: Recebe { refresh }; Retorna { token }
    // AuthLogout: Recebe { nada };  Retorna { nada } --> Apenas anula o refresh token no banco (vamos ter q add essa tabela)
    // AuthMe: Recebe { nada }; Retorna { id, email }

    // ALINHAR OS RETORNOS E OS DTOS
    login(email: string, password: string): Promise<AuthResponseDto>;
    refresh(refresh: string): Promise<AuthResponseDto>;
    logout(refresh: string): Promise<boolean>;
    me(accessToken: string): Promise<UserResponseDto>;
    cadastro(postDto: UserPostRequestDto): Promise<boolean>;


}