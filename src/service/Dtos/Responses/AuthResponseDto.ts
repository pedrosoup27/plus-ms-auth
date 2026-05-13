export class AuthResponseDto{
    constructor(token: string, refresh: string){
        this.token = token;
        this.refresh = refresh;
    }

    token: string;
    refresh: string;
}