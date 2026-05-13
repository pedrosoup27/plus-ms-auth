"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
class AuthResponseDto {
    constructor(token, refresh) {
        this.token = token;
        this.refresh = refresh;
    }
}
exports.AuthResponseDto = AuthResponseDto;
