import { AuthServiceInterface } from '../service/AuthServiceInterface';
import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { UserDto } from '../service/Dtos/UserDto';
import { UserPostRequestDto } from '../service/Dtos/Requests/UserPostRequestDto';

dotenv.config();
//Sugiro a gente migrar pra typescript pra utilizar interfaces e tipagem forte
export class AuthController{
  constructor(authService: AuthServiceInterface){
    this.authService = authService;
  }

  authService: AuthServiceInterface;
  
  async getUserEmailTeste(req: Request, res: Response){
    try{
      const email = String(req.query.email);

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

  // AuthLogin: Recebe { email, password }; Retorna { token, refresh }
  // AuthRefresh: Recebe { refresh }; Retorna { token }
  // AuthLogout: Recebe { nada };  Retorna { nada } --> Apenas anula o refresh token no banco (vamos ter q add essa tabela)
  // AuthMe: Recebe { nada }; Retorna { id, email }
  
  async login(req: Request, res: Response){
    try{
      const { email, password } = req.body;

      var resultado = await this.authService.login(email, password);

      return res.status(200).json(resultado);
    } catch(error){
      return res.status(401).json(error);
    }
  }

  async refresh(req: Request, res: Response){
    try{

      const { refresh } = req.body;

      var resultado = await this.authService.refresh(refresh);

      return res.status(200).json(resultado);

    } catch(error){
      return res.status(401).json(error);
    }
  }

  async logout(req: Request, res: Response){
    try{
      var resultado = await this.authService.logout();

      return res.status(200);
    } catch(error){
      return res.status(401).json(error);
    }
  }

  async me(req: Request, res: Response){
    try{
      var resultado = this.authService.me();

      return res.status(200).json(resultado);

    } catch(error){
      return res.status(401).json(error);
    }
  }

  async cadastro(req: Request, res: Response){
    try{

      const { email, password, role } = req.body;

      var postDto = new UserPostRequestDto(email, password, role);

      var resultado = this.authService.cadastro(postDto);

      return res.status(200).json(resultado);

    } catch(error){
      return res.status(401).json(error);
    }
  }
  
}
