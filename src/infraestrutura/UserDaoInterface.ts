import { UserDto } from "../serviço/Dtos/UserDto"
import { UserEntity } from "../serviço/Dtos/UserEntity"

export interface UserDaoInterface{
    getUserByEmail(email: string): Promise<UserEntity>
    post(userDto: UserDto): Promise<boolean>
    put(userDto: UserDto): Promise<boolean>
    delete(userId: number): Promise<boolean>
}