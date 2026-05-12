import { Pool } from 'pg';
import { UserDaoInterface } from './UserDaoInterface';
import { UserDto } from '../service/Dtos/UserDto';
import { UserEntity } from '../service/Dtos/UserEntity';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export class UserDao implements UserDaoInterface{
    constructor(){
  }

  async getUserByEmail(email: string): Promise<UserEntity>{
      try {
      const { rows } = await pool.query("SELECT id, email, name, password_hash, is_active FROM users WHERE email = $1", [email]);
      
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

  async post(userDto: UserDto): Promise<boolean>{
    return false;
  }

  async put(userDto: UserDto): Promise<boolean>{
    return false;
  }

  async delete(userId: number): Promise<boolean>{
    return false;
  }

}

// const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// const user = rows[0];