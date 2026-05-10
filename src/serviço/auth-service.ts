import { UserDao } from '../infraestrutura/user-dao';

// Injeção de dependência da UserDao (vamos passar para interface)
export class AuthServico{
    constructor(userDao: UserDao){
        this.userDao = userDao;
    }

    userDao: UserDao;

    async login(email: string, password: string){
        if (!email || !password){
            //return res.status(400).json({ error: "email e password são obrigatórios" });
        }

        //user = this.userDao.

    //   if (!user || !(await bcrypt.compare(password, user.password_hash))) // Isso aqui provavelmente vai pro serviço
    //     return res.status(401).json({ error: "Credenciais inválidas" });

    }
}
