import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
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
 * /auth/getUserByEmail:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user info by email
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/getUserByEmail', (req, res) => authController.getUserEmailTeste(req, res));

// ENDPOINTS IMPORTANTES AQUI

// Arrumar os params aqui
/** 
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Log into the website
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nome@email.com
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/login', (req, res) => authController.login(req, res));

router.post('/logout', (req, res) => authController.logout(req, res));

router.post('/refresh', (req, res) => authController.refresh(req, res));

/** 
 * @openapi
 * /auth/cadastro:
 *   post:
 *     tags:
 *       - User
 *     summary: Cadastro de novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nome@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/cadastro', (req, res) => authController.cadastro(req, res));

router.get('/me', (req, res) => authController.me(req, res));

app.use('/auth', router);

app.listen(PORT, () => { 
  console.log(`plus-ms-auth rodando na porta ${PORT}`)

  swaggerDocs(app, PORT);
});
