
class UserDao{
    constructor(){
        
    }
}

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 15432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// const user = rows[0];