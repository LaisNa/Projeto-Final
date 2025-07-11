export type User = {
    id: string;
    email: string;
    user: string;
    password: string | null;
    status: boolean;
}

export type TokenUserData = {
    id: string;
    email: string;
    user: string;
}