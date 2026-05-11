import { UserDao } from '../infraestrutura/UserDao';
import { AuthServiceInterface } from './AuthServiceInterface';
import { UserDto } from './Dtos/UserDto';

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
}
