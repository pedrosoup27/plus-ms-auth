import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserDao } from './infraestrutura/UserDao';
import { AuthService } from './serviço/AuthService';
import { AuthController } from './apresentação/AuthController';
import { Router } from 'express';

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

// Possivelmente passar as rotas para um arquivo authRoute.ts no futuro
const router = Router();
const userDao = new UserDao();
const authService = new AuthService(userDao);
const authController = new AuthController(authService);

router.get('/login', (req: Request, res: Response) => authController.login(req, res));

app.listen(PORT, () => console.log(`plus-ms-auth rodando na porta ${PORT}`));
