import { UserDao } from '../infraestrutura/UserDao';
import { UserDto } from './Dtos/UserDto';

export interface AuthServiceInterface{
    userDao: UserDao;

    login(email: string, password: string): Promise<UserDto>; // Retorna userDto ou Response??


}