import bcrypt from 'bcrypt';
import { AuthenticationResponse, UserInput } from '../types';
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
    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect username or password.');
    }
    return {
        token: generateJwtToken({ username }),
        username: username,
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

export default { getUserByUsername, authenticate, getUserChats };
