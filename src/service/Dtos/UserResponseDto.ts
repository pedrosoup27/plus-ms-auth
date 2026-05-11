export class UserResponseDto{
    // Possível response para o user (ainda sendo implementada)
    constructor(id: number, message: string){
        this.id = id;
        this.message = message;
    }

    id: number;
    message: string;
}