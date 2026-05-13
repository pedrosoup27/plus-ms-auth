import { UserPostRequestDto } from "../../service/Dtos/Requests/UserPostRequestDto"
import { UserDto } from "../../service/Dtos/UserDto"
import { UserEntity } from "../entities/UserEntity"

export interface UserDaoInterface{
    getUserByEmail(email: string): Promise<UserEntity>
    getUserById(userId: string): Promise<UserEntity>
    post(userDto: UserPostRequestDto): Promise<boolean>
    put(userDto: UserPostRequestDto): Promise<boolean>
    delete(userId: string): Promise<boolean>
}