export class UserPostRequestDto{
    constructor(email: string, password: string, role: string){
        this.email = email;
        this.password = password;
        this.role = role;
    }

    email: string;
    password: string;
    role: string;
}