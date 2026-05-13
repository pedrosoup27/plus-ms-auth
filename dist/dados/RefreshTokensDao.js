"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensDao = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const RefreshTokensEntity_1 = require("./entities/RefreshTokensEntity");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 15432,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
});
class RefreshTokensDao {
    constructor() {
    }
    async create(userId, token, expiresAt) {
        try {
            const query = "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3);";
            const params = [userId, token, expiresAt];
            var resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        }
        catch (error) {
            console.error("Erro ao criar refresh token:", error);
            throw error;
        }
    }
    async findByToken(token) {
        try {
            const query = "SELECT id, user_id, token, expires_at, created_at FROM refresh_tokens WHERE token = $1 AND expires_at > NOW();";
            const params = [token];
            var resultado = await pool.query(query, params);
            const row = resultado.rows[0];
            return new RefreshTokensEntity_1.RefreshTokensEntity(row.id, row.user_id, row.token, row.expires_at, row.created_at);
        }
        catch (error) {
            console.error("Erro ao buscar refresh token", error);
            throw error;
        }
    }
    async deleteByToken(token) {
        try {
            const query = "DELETE FROM refresh_tokens WHERE token = $1;";
            const params = [token];
            const resultado = await pool.query(query, params);
            return resultado.rowCount === 1;
        }
        catch (error) {
            console.error("Erro ao deletar refresh token", error);
            throw error;
        }
    }
    async deleteExpiredTokens() {
        try {
            const query = "DELETE FROM refresh_tokens WHERE expires_at <= NOW();";
            await pool.query(query);
        }
        catch (error) {
            console.error("Erro ao deletar refresh tokens expirados", error);
            throw error;
        }
    }
}
exports.RefreshTokensDao = RefreshTokensDao;
