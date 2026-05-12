import { AuthServiceInterface } from '../service/AuthServiceInterface';
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { UserDto } from '../service/Dtos/UserDto';

dotenv.config();
//Sugiro a gente migrar pra typescript pra utilizar interfaces e tipagem forte
export class AuthController{
  constructor(authService: AuthServiceInterface){
    this.authService = authService;
  }

  authService: AuthServiceInterface;
  
  async login(req: Request, res: Response){
    try{
      const { email, password } = req.body;

      var resultado = await this.authService.login(email, password);

      return res.status(200).json(resultado);
    } catch(error){
      return res.status(401).json(error);
    }
  }

  async getUserEmailTeste(req: Request, res: Response){
    try{
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email é obrigatório" });
      }

      const resultado = await this.authService.getLoginTeste(email);

      return res.status(200).json(resultado);
    } catch(error){

      console.error("Erro no Controller:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
  
}
