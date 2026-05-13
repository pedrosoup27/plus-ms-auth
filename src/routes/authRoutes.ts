import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../service/AuthService';
import { UserDao } from '../dados/UserDao';
import { RefreshTokensDao } from '../dados/RefreshTokensDao';

const router = Router();
const userDao = new UserDao();
const tokenDao = new RefreshTokensDao();
const authService = new AuthService(userDao, tokenDao);
const authController = new AuthController(authService);

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
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Log out and invalidate the current refresh token
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', (req, res) => authController.logout(req, res));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - User
 *     summary: Refresh the access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Refresh token accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh:
 *                   type: string
 *       401:
 *         description: Invalid refresh token
 */
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

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get authenticated user information
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', (req, res) => authController.me(req, res));

export default router;