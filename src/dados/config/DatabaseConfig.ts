import { Pool } from "pg";
import 'dotenv/config';

if (!process.env.DB_HOST || !process.env.DB_USER) {
  throw new Error('Variáveis de ambiente de DB não configuradas');
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 15432,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool', err);
});

export default pool;