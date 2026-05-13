"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    // Dto padrão do projeto (pode ser Request para put/post)
    constructor(id, email, password, role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
exports.UserDto = UserDto;
