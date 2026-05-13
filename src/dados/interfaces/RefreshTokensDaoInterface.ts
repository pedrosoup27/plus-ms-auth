import { UserPostRequestDto } from "../../service/Dtos/Requests/UserPostRequestDto"
import { UserDto } from "../../service/Dtos/UserDto"
import { RefreshTokensEntity } from "../entities/RefreshTokensEntity";
import { UserEntity } from "../entities/UserEntity"

export interface RefreshTokensDaoInterface{
    create(userId: number, token: string, expiresAt: Date): Promise<boolean>;
    findByToken(token: string): Promise<RefreshTokensEntity>;
    deleteByToken(token: string): Promise<boolean>;
    deleteExpiredTokens(): Promise<void>;
}