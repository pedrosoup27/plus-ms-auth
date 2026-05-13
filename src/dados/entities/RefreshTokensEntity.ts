export class RefreshTokensEntity{
    constructor(id: number, user_id: string, token: string, expires_at: Date, created_at: Date){
        this.id = id;
        this.user_id = user_id;
        this.token = token;
        this.expires_at = expires_at;
        this.created_at = created_at;
    }

    id: number;
    user_id: string;
    token: string;
    expires_at: Date;
    created_at: Date;
}