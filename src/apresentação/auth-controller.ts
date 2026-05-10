import { AuthServico } from '../serviço/auth-service';
import * as dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
//Sugiro a gente migrar pra typescript pra utilizar interfaces e tipagem forte
class AuthController{
    constructor(){

  }


    
}

const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4001"],
  credentials: true
}));

const PORT = process.env.PORT || 3001;

// app.post

// POST /auth/login
app.post("/auth/login", async (req: Request, res: Response) => {
  // const { email, password } = req.body;

  // if (!email || !password)
    // return res.status(400).json({ error: "email e password são obrigatórios" }); // Isso fica aqui

    //   const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]); Isso vai pra dao

    //   const user = rows[0]; isso vai pro serviço como resposta da dao

    //   if (!user || !(await bcrypt.compare(password, user.password_hash))) Isso aqui provavelmente vai pro serviço
    //     return res.status(401).json({ error: "Credenciais inválidas" });

    //   const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { // Serviço
    //     expiresIn: "15m",
    //   });
    //   const refresh = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" }); // Serviço

  // res.json({ token, refresh });
});

// Revisar o restante (Não mexi ainda)

// // POST /auth/refresh
// app.post("/auth/refresh", (req, res) => {
//   const { refresh } = req.body;
//   if (!refresh) return res.status(400).json({ error: "refresh token obrigatório" });

//   try {
//     const payload = jwt.verify(refresh, JWT_SECRET);
//     const token = jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: "15m" });
//     res.json({ token });
//   } catch {
//     res.status(401).json({ error: "Refresh token inválido ou expirado" });
//   }
// });

// // POST /auth/logout
// app.post("/auth/logout", (_req, res) => {
//   // Stateless: em produção invalidar o refresh token no banco
//   res.status(204).send();
// });

// // GET /auth/me
// app.get("/auth/me", (req, res) => {
//   const auth = req.headers.authorization;
//   if (!auth?.startsWith("Bearer "))
//     return res.status(401).json({ error: "Token não fornecido" });

//   try {
//     const payload = jwt.verify(auth.slice(7), JWT_SECRET);
//     res.json({ id: payload.sub, email: payload.email });
//   } catch {
//     res.status(401).json({ error: "Token inválido ou expirado" });
//   }
// });

