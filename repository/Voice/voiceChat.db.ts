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

const createVoiceChat = async ({username} : {username: string}, {name} : {name? : string }, {language} : {language : string }): Promise<VoiceChat> => {
    
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
                language: language
            },
        });

        return VoiceChat.from(voiceChatPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Coudln\'t create chat for user.');
    }

};

const getVoiceChatsByUsername = async (username: string ): Promise<VoiceChat[]> => {
    try {
        const voiceChatsPrisma = await database.voiceChat.findMany({
            where: {
                user: {
                    username: username,
                },
            }
        });

        return voiceChatsPrisma.map((chat) => VoiceChat.from(chat));
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

const deleteVoiceMessagesByVoiceChatId = async (id: number): Promise<VoiceChat> => {
    try {
        const voiceChatPrisma = await database.voiceChat.delete({
            where: {
                id: id
            }
        });

        return VoiceChat.from(voiceChatPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};




const getVoiceMessagesByVoiceChatId = async (chatid: number): Promise<VoiceMessage[]> => {
    try {
        const voiceMessagesPrisma = await database.voiceMessage.findMany({
            where: {
                chatId: chatid,
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

const getLanguageById = async (id: number): Promise<string | null> => {
    try {
      const voiceChat = await database.voiceChat.findUnique({
        where: { id },
        select: { language: true },
      });
  
      return voiceChat?.language ?? null;
    } catch (error) {
      console.error(error);
      throw new Error('Database error. Could not retrieve language.');
    }
  };

export default {
    createVoiceChat,
    getVoiceChatsByUsername,
    getVoiceChatById,
    getVoiceMessagesByVoiceChatId,
    deleteVoiceMessagesByVoiceChatId,
    getLanguageById
};
