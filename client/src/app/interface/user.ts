export interface User {
    googleId: string;
    email: string;
    name: string;
    picture: string;
}

export interface AuthResponse {
    user: User;
}