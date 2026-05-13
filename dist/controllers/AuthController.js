"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const dotenv = __importStar(require("dotenv"));
const UserPostRequestDto_1 = require("../service/Dtos/Requests/UserPostRequestDto");
dotenv.config();
//Sugiro a gente migrar pra typescript pra utilizar interfaces e tipagem forte
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getUserEmailTeste(req, res) {
        try {
            const email = String(req.query.email);
            if (!email) {
                return res.status(400).json({ error: "Email é obrigatório" });
            }
            const resultado = await this.authService.getLoginTeste(email);
            return res.status(200).json(resultado);
        }
        catch (error) {
            console.error("Erro no Controller:", error);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
    // AuthLogin: Recebe { email, password }; Retorna { token, refresh }
    // AuthRefresh: Recebe { refresh }; Retorna { token }
    // AuthLogout: Recebe { nada };  Retorna { nada } --> Apenas anula o refresh token no banco (vamos ter q add essa tabela)
    // AuthMe: Recebe { nada }; Retorna { id, email }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            var resultado = await this.authService.login(email, password);
            return res.status(200).json(resultado);
        }
        catch (error) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
    }
    async refresh(req, res) {
        try {
            const { refresh } = req.body;
            var resultado = await this.authService.refresh(refresh);
            return res.status(200).json(resultado);
        }
        catch (error) {
            return res.status(401).json({ error: "Token inválido" });
        }
    }
    async logout(req, res) {
        try {
            const { refresh } = req.body;
            var resultado = await this.authService.logout(refresh);
            return res.status(200).json({ success: true });
        }
        catch (error) {
            return res.status(401).json({ error: "Token inválido" });
        }
    }
    async me(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Token de acesso obrigatório' });
            }
            const accessToken = authHeader.substring(7);
            var resultado = await this.authService.me(accessToken);
            return res.status(200).json(resultado);
        }
        catch (error) {
            return res.status(401).json({ error: "Token inválido" });
        }
    }
    async cadastro(req, res) {
        try {
            const { email, password, role } = req.body;
            var postDto = new UserPostRequestDto_1.UserPostRequestDto(email, password, role);
            var resultado = await this.authService.cadastro(postDto);
            return res.status(200).json(resultado);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro interno" });
        }
    }
}
exports.AuthController = AuthController;
