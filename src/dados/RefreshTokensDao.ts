import { Pool } from 'pg';
import { UserDaoInterface } from './interfaces/UserDaoInterface';
import { UserDto } from '../service/Dtos/UserDto';
import { UserEntity } from './entities/UserEntity';
import 'dotenv/config';
import { UserPostRequestDto } from '../service/Dtos/Requests/UserPostRequestDto';
import { RefreshTokensDaoInterface } from './interfaces/RefreshTokensDaoInterface';
import { RefreshTokensEntity } from './entities/RefreshTokensEntity';
import pool from './config/DatabaseConfig';

export class RefreshTokensDao implements RefreshTokensDaoInterface{
    constructor(){
  }

    async create(userId: number, token: string, expiresAt: Date): Promise<boolean>{
        try{
            const query = "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3);";
            const params = [userId, token, expiresAt];

            var resultado = await pool.query(query, params);

            return resultado.rowCount === 1;
        } catch(error){
            console.error("Erro ao criar refresh token:", error);
            throw error;
        }
    }

    async findByToken(token: string): Promise<RefreshTokensEntity | null>{
        try{
            const query = "SELECT id, user_id, token, expires_at, created_at FROM refresh_tokens WHERE token = $1 AND expires_at > NOW();";
            const params = [ token ];

            var resultado = await pool.query(query, params);

            if (resultado.rows.length === 0) {
                return null;
            }

            const row = resultado.rows[0];

            return new RefreshTokensEntity(row.id, row.user_id, row.token, row.expires_at, row.created_at);

        } catch(error){
            console.error("Erro ao buscar refresh token", error);
            throw error;
        }
    }

    async deleteByToken(token: string): Promise<boolean>{
        try{
            const query = "DELETE FROM refresh_tokens WHERE token = $1;";
            const params = [ token ];

            const resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        } catch(error){
            console.error("Erro ao deletar refresh token", error);
            throw error;
        }
    }

    async deleteExpiredTokens(): Promise<void>{
        try{
            const query = "DELETE FROM refresh_tokens WHERE expires_at <= NOW();";
            await pool.query(query);
        } catch(error){
            console.error("Erro ao deletar refresh tokens expirados", error);
            throw error;
        }
    }

}