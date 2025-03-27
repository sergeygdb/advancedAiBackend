
export type UserInput = {
    id?: number;
    username?: string;
    password?: string;
};

export type AuthenticationResponse = {
    token: string;
    username: string;
};
