import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserDao } from './infraestrutura/UserDao';
import { AuthService } from './service/AuthService';
import { AuthController } from './controllers/AuthController';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import swaggerDocs from './swagger';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3001); // const PORT = process.env.PORT || 3001;

// swaggerDocs(app, PORT);

// // Possivelmente passar as rotas para um arquivo authRoute.ts no futuro
const router = Router();
const userDao = new UserDao();
const authService = new AuthService(userDao);
const authController = new AuthController(authService);

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/login', (req, res) => authController.login(req, res));

app.use('/auth', router);

app.listen(PORT, () => { 
  console.log(`plus-ms-auth rodando na porta ${PORT}`)

  swaggerDocs(app, PORT);
});
