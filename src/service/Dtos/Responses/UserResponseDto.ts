export class UserResponseDto{
    // Possível response para o user (ainda sendo implementada)
    constructor(id: number, email: string){
        this.id = id;
        this.email = email;
    }

    id: number;
    email: string;
}