export interface IAuthManager {
    newToken(userId: string): string;
    verifyToken(token: string): string | null;
}

export interface JwtPlaceholder {
    cameristId: string;
}
