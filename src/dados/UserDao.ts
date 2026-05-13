import { Pool } from 'pg';
import { UserDaoInterface } from './interfaces/UserDaoInterface';
import { UserDto } from '../service/Dtos/UserDto';
import { UserEntity } from './entities/UserEntity';
import 'dotenv/config';
import { UserPostRequestDto } from '../service/Dtos/Requests/UserPostRequestDto';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 15432,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

console.log(
  "Host: ", process.env.DB_HOST,
  "Port: ", process.env.DB_PORT,
  "User: ", process.env.DB_USER,
  "Password: ", process.env.DB_PASSWORD,
  "Database: ", process.env.DB_NAME
);

export class UserDao implements UserDaoInterface{
    constructor(){
  }

  async getUserByEmail(email: string): Promise<UserEntity>{
      try {
      const { rows } = await pool.query("SELECT id, email, password_hash, is_active FROM users WHERE email = $1", [email]);
      
      if (rows.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      
      const { id, userEmail, password_hash, role, isActive } = rows[0];
      return new UserEntity(id, userEmail, password_hash, role, isActive);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserEntity>{
    try {
      const { rows } = await pool.query("SELECT id, email, password_hash, is_active FROM users WHERE id = $1", [userId]);
      
      if (rows.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      
      const { id, userEmail, password_hash, role, isActive } = rows[0];
      return new UserEntity(id, userEmail, password_hash, role, isActive);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  }

  async post(userDto: UserPostRequestDto): Promise<boolean>{
    try{
      const query = 'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, $4)';

      const params = [ userDto.email, userDto.password, userDto.role, true ];

      const resultado = await pool.query(query, params);

      return resultado.rowCount === 1;

    } catch(error){
      console.error("Erro ao incluir usuário:", error);
      throw error;
    }

  }

  async put(userDto: UserPostRequestDto): Promise<boolean>{
    try{
      const query = 'UPDATE users SET email = $1, password_hash = $2, role = $3, is_active = $4 WHERE id = $5';

      const params = [ userDto.email, userDto.password, userDto.role, true ];

      const resultado = await pool.query(query, params);

      return resultado.rowCount === 1;
    } catch(error){
      console.error("Erro ao alterar usuário:", error);
      throw error;
    }
  }

  async delete(userId: string): Promise<boolean>{
    try{
      const query = "UPDATE users SET is_active = $1 WHERE id = $2";

      const params = [ false, userId ];

      const resultado = await pool.query(query, params);

      return resultado.rowCount === 1;
    } catch(error){
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  }

}