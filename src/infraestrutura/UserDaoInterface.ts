import { UserDto } from "../service/Dtos/UserDto"
import { UserEntity } from "../service/Dtos/UserEntity"

export interface UserDaoInterface{
    getUserByEmail(email: string): Promise<UserEntity>
    getUserById(userId: string): Promise<UserEntity>
    post(userDto: UserDto): Promise<boolean>
    put(userDto: UserDto): Promise<boolean>
    delete(userId: string): Promise<boolean>
}