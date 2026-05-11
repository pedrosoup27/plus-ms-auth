require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4001"],
  credentials: true
}));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const PORT = process.env.PORT || 3002;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plus MS Auth API',
      version: '1.0.0',
      description: 'Authentication microservice for Plus stock management system',
    },
    servers: [
      {
        url: 'http://localhost:4566/restapis/{restapi_id}/v1/_user_request_/auth',
        variables: {
          restapi_id: {
            default: 'plus-api',
          },
        },
      },
    ],
  },
  apis: ['./src/index.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
// POST /auth/login
app.post("/auth/login", async (req, res) => {
  try {
    console.log("pediuuuuu")
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email e password são obrigatórios" });

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: "Credenciais inválidas" });

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, refresh });
  } catch (error) {
    console.error("Error in /auth/login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, gestor, vendedor]
 *                 default: vendedor
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */
// POST /auth/register
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, role = "vendedor" } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email e password são obrigatórios" });

    if (!["admin", "gestor", "vendedor"].includes(role))
      return res.status(400).json({ error: "role inválido" });

    const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (rows.length > 0)
      return res.status(409).json({ error: "Email já cadastrado" });

    const password_hash = await bcrypt.hash(password, 10);
    const { rows: insertRows } = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, password_hash, role]
    );

    const user = insertRows[0];
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, refresh, user });
  } catch (error) {
    console.error("Error in /auth/register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh
 *             properties:
 *               refresh:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
// POST /auth/refresh
app.post("/auth/refresh", (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ error: "refresh token obrigatório" });

  try {
    const payload = jwt.verify(refresh, JWT_SECRET);
    const token = jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ token });
  } catch {
    res.status(401).json({ error: "Refresh token inválido ou expirado" });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     responses:
 *       204:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
// POST /auth/logout
app.post("/auth/logout", (_req, res) => {
  // Stateless: em produção invalidar o refresh token no banco
  res.status(204).send();
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
// GET /auth/me
app.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Token não fornecido" });

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ id: payload.sub, email: payload.email, role: payload.role });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

/**
 * @swagger
 * /auth/introspect:
 *   post:
 *     summary: Introspect JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token introspection result
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     active:
 *                       type: boolean
 *                       example: true
 *                     sub:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     active:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Internal server error
 */
// POST /auth/introspect
app.post("/auth/introspect", (req, res) => {
  const { token } = req.body;
  if (!token) return res.json({ active: false });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ active: true, sub: payload.sub, email: payload.email, role: payload.role });
  } catch {
    res.json({ active: false });
  }
});

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          VARCHAR(50) NOT NULL DEFAULT 'vendedor',
      created_at    TIMESTAMP DEFAULT NOW()
    );
  `);

  const users = [
    { email: "admin@plus.com",    password: "admin123",    role: "admin"    },
    { email: "gestor@plus.com",   password: "gestor123",   role: "gestor"   },
    { email: "vendedor@plus.com", password: "vendedor123", role: "vendedor" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [u.email, hash, u.role]
    );
  }

  console.log("Banco iniciado e seed aplicado.");
}

async function startServer() {
  const maxAttempts = 10;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await seed();
      break;
    } catch (err) {
      console.error(`DB seed attempt ${attempt} failed:`, err.message || err);
      if (attempt === maxAttempts) {
        console.error("Failed to connect to the database after multiple attempts.");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  app.listen(PORT, () => console.log(`plus-ms-auth rodando na porta ${PORT}`));
}

startServer();