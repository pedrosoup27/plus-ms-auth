export class UserDto{
    // Dto padrão do projeto (pode ser Request para put/post)
    constructor(id: number, email: string, password: string, role: string){
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    id: number;
    email: string;
    password: string;
    role: string;

}