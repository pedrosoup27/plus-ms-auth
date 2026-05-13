"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    // Entidade user exatametne como está no banco
    constructor(id, email, password, role, isActive) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
    }
}
exports.UserEntity = UserEntity;
