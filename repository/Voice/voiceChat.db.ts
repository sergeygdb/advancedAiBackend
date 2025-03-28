import { OpenAI } from 'openai';
import { Chat } from '../../model/Text/chat';
import database from '../../util/database';
import userDb from '../user.db';
import { Message } from '../../model/Text/message';
import { VoiceChat } from '../../model/Voice/voicechat';
import { VoiceMessage } from '../../model/Voice/voiceMessage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const maxWords = 6;

const systemMessage = {
  role: 'system',
  content: `You are a helpful assistant who answers with only maximum ${maxWords} words. If you can't make a response with max ${maxWords} words, response with "ERROR: Response limit exceeded!".`,
};

const createVoiceChat = async ({username} : {username: string}, {name} : {name? : string }): Promise<VoiceChat> => {
    
    let user;

    try {
        user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error('User not found.');
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('User not found.');
    }
    
    try {
        const voiceChatPrisma = await database.voiceChat.create({
            data: {
                name: name,
                user: {
                    connect: {
                        id: user.getId(),
                    },
                },
            },
        });

        return VoiceChat.from(voiceChatPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Coudln\'t create chat for user.');
    }

};

const getVoiceChatByUsername = async ({ username }: { username: string }): Promise<VoiceChat | null> => {
    try {
        const voiceChatPrisma = await database.voiceChat.findFirst({
            where: {
                user: {
                    username: username,
                },
            },
            include: {
                messages: true,
            },
        });

        return voiceChatPrisma ? VoiceChat.from(voiceChatPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getVoiceChatById = async ({ id }: { id: number }): Promise<VoiceChat | null> => {
    try {
        const voiceChatPrisma = await database.voiceChat.findFirst({
            where: {
                id: id,
            },
            include: {
                messages: true,
            },
        });

        return voiceChatPrisma ? VoiceChat.from(voiceChatPrisma) : null;
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getVoiceMessagesByVoiceChatId = async ({ chatId }: { chatId: number }): Promise<VoiceMessage[]> => {
    try {
        const voiceMessagesPrisma = await database.voiceMessage.findMany({
            where: {
                chatId: chatId,
            },
            include: {
                correction: {
                    include: {
                        mistakes: true,
                    },
                }
            },
        });

        return voiceMessagesPrisma.map(voiceMessage => VoiceMessage.from(voiceMessage));
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    createVoiceChat,
    getVoiceChatByUsername,
    getVoiceChatById,
    getVoiceMessagesByVoiceChatId,
};
