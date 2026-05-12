import { UserDao } from '../infraestrutura/UserDao';
import { UserDto } from './Dtos/UserDto';
import { UserResponseDto } from './Dtos/UserResponseDto';

export interface AuthServiceInterface{
    userDao: UserDao;

    // Método para teste dos endpoints
    getLoginTeste(email: string): Promise<UserDto>;
    
    login(email: string, password: string): Promise<UserDto>;
    refresh(): Promise<UserResponseDto>;
    logout(): Promise<UserResponseDto>;
    me(): Promise<UserDto>;


}