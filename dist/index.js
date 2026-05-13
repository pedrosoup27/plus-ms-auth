"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const UserDao_1 = require("./dados/UserDao");
const AuthService_1 = require("./service/AuthService");
const AuthController_1 = require("./controllers/AuthController");
const express_2 = require("express");
const swagger_1 = __importDefault(require("./swagger"));
const RefreshTokensDao_1 = require("./dados/RefreshTokensDao");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000' // O leão de chácara só deixa entrar quem vier desta URL exata!
}));
app.use(express_1.default.json());
const PORT = Number(process.env.PORT ?? 3001); // const PORT = process.env.PORT || 3001;
// swaggerDocs(app, PORT);
// // Possivelmente passar as rotas para um arquivo authRoute.ts no futuro
const router = (0, express_2.Router)();
const userDao = new UserDao_1.UserDao();
const refreshTokensDao = new RefreshTokensDao_1.RefreshTokensDao();
const authService = new AuthService_1.AuthService(userDao, refreshTokensDao);
const authController = new AuthController_1.AuthController(authService);
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
router.get('/healthcheck', (req, res) => { res.status(200).send('OK'); });
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
app.use('/auth', router);
app.listen(PORT, () => {
    console.log(`plus-ms-auth rodando na porta ${PORT}`);
    (0, swagger_1.default)(app, PORT);
});
