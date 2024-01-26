export interface profile{
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    jwt?: string;
}

export type findOneProfileResult = profile | null;