export class UserEntity{
    // Entidade user exatametne como está no banco
    constructor(id: number, email: string, password: string, role: string, isActive: boolean){
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
    }

    id: number;
    email: string;
    password: string;
    role: string;
    isActive: boolean;

}