export type UserInput = {
    id?: number;
    username?: string;
    password?: string;
};

export type AuthenticationResponse = {
    token: string;
    username: string;
    id?: number;
};

export type RegisterUser = {
    id?: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type FlashCardInput = {
    id?: number;
    userId?: number;
    question: string;
    answer: string;
    topic: string;
    createdAt?: Date;
};
