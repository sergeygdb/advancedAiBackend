import bcrypt from 'bcrypt';
import { AuthenticationResponse, RegisterUser, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';
import { User } from '../model/user';
import userDb from '../repository/user.db';
import chatService from './text/chat.service';
import voiceChatService from './voice/voiceChat.service';

const getUserByUsername = async ({ username }: { username: string }): Promise<User> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }
    return user;
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    if (!username || !password) {
        throw new Error('Username and password are required.');
    }
    const user = await getUserByUsername({ username });

    if (!user) {
        throw new Error('Incorrect username or password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect username or password.');
    }

    console.log({
        token: generateJwtToken(user.getUsername(), user.getId()!.toString()),
        username: user.getUsername(),
        id: user.getId(),
    });

    return {
        token: generateJwtToken(user.getUsername(), user.getId()!.toString()),
        username: user.getUsername(),
        id: user.getId(),
    };
};

const getUserChats = async ({ username }: { username: string }) => {
    const user = await getUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }

    const voiceChats = await voiceChatService.getVoiceChatsByUsername(username);
    const chats = await chatService.getChatsByUsername({ username });

    return {
        voiceChats,
        chats,
    };
};

const doesEmailExist = async (email: string): Promise<boolean> => {
    const user = await userDb.getAllUsers();
    return user.some((user) => user.getEmail() === email);
};

const doesUserExist = async (username: string): Promise<boolean> => {
    const user = await userDb.getUserByUsername({ username });
    return !!user;
};

const registerUser = async (user: RegisterUser): Promise<User> => {
    if (!user) {
        throw new Error('User is undefined');
    }

    if (await doesUserExist(user.username)) {
        throw new Error(`User with username: ${user.username} already exists.`);
    }

    if (await doesEmailExist(user.email)) {
        throw new Error(`User with email: ${user.email} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = {
        ...user,
        password: hashedPassword,
    };

    const newUser = await userDb.registerUser(userWithHashedPassword);

    return newUser;
};

export default {
    getUserByUsername,
    authenticate,
    getUserChats,
    doesEmailExist,
    registerUser,
    doesUserExist,
};
