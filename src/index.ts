import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserDao } from './infraestrutura/UserDao';
import { AuthService } from './service/AuthService';
import { AuthController } from './controllers/AuthController';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import swaggerDocs from './swagger';
import { ok } from 'node:assert';

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

/**
 * @openapi
 * /auth/healthcheck:
 *   get:
 *     tags:
 *       - Healthcheck
 *     description: Responds if app is up and running
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/healthcheck', (req, res) => { res.status(200).send('OK') })

/** 
 * @openapi
 * /auth/teste:
 *   post:
 *     tags:
 *       - User
 *     summary: Get user info by email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: aluno@pucrs.br
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/teste', (req, res) => authController.getUserEmailTeste(req, res));

router.post('/login', (req, res) => authController.login(req, res));

app.get('/testedireto', (req, res) => res.send('O servidor está ouvindo!'));

app.use('/auth', router);

app.listen(PORT, () => { 
  console.log(`plus-ms-auth rodando na porta ${PORT}`)

  swaggerDocs(app, PORT);
});
