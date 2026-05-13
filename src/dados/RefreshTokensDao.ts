import { Pool } from 'pg';
import { UserDaoInterface } from './interfaces/UserDaoInterface';
import { UserDto } from '../service/Dtos/UserDto';
import { UserEntity } from './entities/UserEntity';
import 'dotenv/config';
import { UserPostRequestDto } from '../service/Dtos/Requests/UserPostRequestDto';
import { RefreshTokensDaoInterface } from './interfaces/RefreshTokensDaoInterface';
import { RefreshTokensEntity } from './entities/RefreshTokensEntity';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 15432,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

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

    async findByToken(token: string): Promise<RefreshTokensEntity>{
        try{
            const query = "SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW();";
            const params = [ token ];

            var resultado = await pool.query(query, params);

            const row = resultado.rows[0];

            return new RefreshTokensEntity(row.id, row.user_id, row.token, row.expiresAt, row.created_at);

        } catch(error){
            console.error("Erro ao buscar refresh token", error);
            throw error;
        }
    }

    // Implementar posteriormente (não urgente)

    // async deleteByToken(token: string): Promise<boolean>{
    //     try{
            
    //     } catch(error){
    //         console.error("Erro ao buscar deletar token", error);
    //         throw error;
    //     }
    // }

    // async deleteExpiredTokens(): Promise<void>{
    //     try{
            
    //     } catch(error){
    //         console.error("Erro ao buscar deletar tokens expiradas", error);
    //         throw error;
    //     }
    // }

}