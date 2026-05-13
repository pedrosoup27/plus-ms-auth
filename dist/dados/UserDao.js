"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDao = void 0;
const pg_1 = require("pg");
const UserEntity_1 = require("./entities/UserEntity");
require("dotenv/config");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 15432,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
});
console.log("Host: ", process.env.DB_HOST, "Port: ", process.env.DB_PORT, "User: ", process.env.DB_USER, "Password: ", process.env.DB_PASSWORD, "Database: ", process.env.DB_NAME);
class UserDao {
    constructor() {
    }
    async getUserByEmail(email) {
        try {
            const { rows } = await pool.query("SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1", [email]);
            if (rows.length === 0) {
                throw new Error("Usuário não encontrado");
            }
            const { id, email: userEmail, password_hash, role, is_active } = rows[0];
            return new UserEntity_1.UserEntity(id, userEmail, password_hash, role, is_active);
        }
        catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            const { rows } = await pool.query("SELECT id, email, password_hash, role, is_active FROM users WHERE id = $1", [userId]);
            if (rows.length === 0) {
                throw new Error("Usuário não encontrado");
            }
            const { id, email: userEmail, password_hash, role, is_active } = rows[0];
            return new UserEntity_1.UserEntity(id, userEmail, password_hash, role, is_active);
        }
        catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw error;
        }
    }
    async post(userDto) {
        try {
            const query = 'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, $4)';
            const params = [userDto.email, userDto.password, userDto.role, true];
            const resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        }
        catch (error) {
            console.error("Erro ao incluir usuário:", error);
            throw error;
        }
    }
    async put(userDto) {
        try {
            const query = 'UPDATE users SET email = $1, password_hash = $2, role = $3, is_active = $4 WHERE id = $5';
            const params = [userDto.email, userDto.password, userDto.role, true];
            const resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        }
        catch (error) {
            console.error("Erro ao alterar usuário:", error);
            throw error;
        }
    }
    async delete(userId) {
        try {
            const query = "UPDATE users SET is_active = $1 WHERE id = $2";
            const params = [false, userId];
            const resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        }
        catch (error) {
            console.error("Erro ao excluir usuário:", error);
            throw error;
        }
    }
}
exports.UserDao = UserDao;
