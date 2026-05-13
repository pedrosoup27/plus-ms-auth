"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensEntity = void 0;
class RefreshTokensEntity {
    constructor(id, user_id, token, expires_at, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.token = token;
        this.expires_at = expires_at;
        this.created_at = created_at;
    }
}
exports.RefreshTokensEntity = RefreshTokensEntity;
