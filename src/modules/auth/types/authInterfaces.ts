export interface LoginResponse {
    message: string;
    data: Data;
}

export interface Data {
    token: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string;
    permissions: string;
}