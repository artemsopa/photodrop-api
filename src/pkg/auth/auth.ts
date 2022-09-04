export interface IAuthManager {
    newToken(key: string): string;
    verifyToken(token: string): string | null;
}

export interface JwtPlaceholder {
    key: string;
}
