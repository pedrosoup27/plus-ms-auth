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
        var userDto = this.userDao.getUserByEmail(email);

      //   if (!user || !(await bcrypt.compare(password, user.password_hash))) // Isso aqui provavelmente vai pro serviço
     //     return res.status(401).json({ error: "Credenciais inválidas" });
        return new UserDto(1, "a", "a", "a");
    }
}
