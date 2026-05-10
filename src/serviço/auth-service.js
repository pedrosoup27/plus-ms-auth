import { UserDao } from '../infraestrutura/user-dao';

// Injeção de dependência da UserDao
class AuthServico{
    constructor(UserDao){
        this.UserDao = UserDao;
    }

    async login(email, password){
        if (!email || !password){
            return res.status(400).json({ error: "email e password são obrigatórios" });
        }

      if (!user || !(await bcrypt.compare(password, user.password_hash))) // Isso aqui provavelmente vai pro serviço
        return res.status(401).json({ error: "Credenciais inválidas" });

    }
}
