
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        user: { id: number; email: string; name: string; role: string };
        token: string;
    };
}