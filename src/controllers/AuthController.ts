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
  
  // Por hora o método de login simplesmente busca o email no banco e retorna o dto
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
    const { email } = req.body;

    var resultado = await this.authService.getLoginTeste(email);

    return res.status(200).json(resultado);
  }
  
}

