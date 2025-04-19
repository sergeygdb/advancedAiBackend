import { OpenAI } from 'openai';
import { Chat } from '../../model/Text/chat';
import database from '../../util/database';
import userDb from '../user.db';
import { Message } from '../../model/Text/message';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

const maxWords = 6;

const systemMessage = {
    role: 'system',
    content: `You are a helpful assistant who answers with only maximum ${maxWords} words. If you can't make a response with max ${maxWords} words, response with "ERROR: Response limit exceeded!".`,
};

const createChat = async (
    { username }: { username: string },
    { name }: { name?: string }
): Promise<Chat> => {
    let user;

    try {
        user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error('User not found.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('User not found.');
    }

    try {
        const chatPrisma = await database.chat.create({
            data: {
                name: name,
                user: {
                    connect: {
                        id: user.getId(),
                    },
                },
            },
        });

        return Chat.from(chatPrisma);
    } catch (error) {
        console.error(error);
        throw new Error("Coudln't create chat for user.");
    }
};

const getChatByUsername = async ({ username }: { username: string }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.findFirst({
            where: {
                user: {
                    username: username,
                },
            },
            include: {
                messages: true,
            },
        });

        return chatPrisma ? Chat.from(chatPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getChatById = async ({ id }: { id: number }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.findFirst({
            where: {
                id: id,
            },
            include: {
                messages: true,
            },
        });

        return chatPrisma ? Chat.from(chatPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getMessagesByChatId = async ({ chatId }: { chatId: number }): Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            where: {
                chatId: chatId,
            },
        });

        return messagesPrisma.map((message) => Message.from(message));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getChatsByUsername = async ({ username }: { username: string }) => {
    try {
        const user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error('User not found.');
        }

        const chatsPrisma = await database.chat.findMany({
            where: {
                userId: user.getId(),
            },
            include: {
                messages: true,
            },
        });

        return chatsPrisma.map((chat) => Chat.from(chat));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getChatByUsername,
    createChat,
    getChatById,
    getMessagesByChatId,
    getChatsByUsername,
};
