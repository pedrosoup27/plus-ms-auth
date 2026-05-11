import { AuthServiceInterface } from '../serviço/AuthServiceInterface';
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
//Sugiro a gente migrar pra typescript pra utilizar interfaces e tipagem forte
class AuthController{
  constructor(authService: AuthServiceInterface){
    this.authService = authService;
  }

  authService: AuthServiceInterface;
    
  async login(req: Request, res: Response){
    try{
      const { email, password } = req.body;

      var resultado = this.authService.login(email, password);

      return res.status(200).json(resultado.catch);
      // return res
    } catch(error){
      return res.status(401).json(error);
    }
  }
  
}

