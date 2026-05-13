import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { UserDao } from './dados/UserDao';
import { AuthService } from './service/AuthService';
import { AuthController } from './controllers/AuthController';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import swaggerDocs from './swagger';
import { ok } from 'node:assert';
import { RefreshTokensDao } from './dados/RefreshTokensDao';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:3000' // O leão de chácara só deixa entrar quem vier desta URL exata!
}));
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3001); // const PORT = process.env.PORT || 3001;

app.use('/auth', authRoutes);

app.listen(PORT, () => { 
  console.log(`plus-ms-auth rodando na porta ${PORT}`)

  swaggerDocs(app, PORT);
});
