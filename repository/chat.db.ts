import { Chat } from '../model/chat';
import database from '../util/database';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemMessage = {
  role: 'system',
  content: 'You are a helpful assistant who answers with only maximum 3 words',
};

const createChatResponse = async ({ prompt }: { prompt: string }): Promise<string> => {
    let chatHistory: any[] = [];
    chatHistory.unshift(systemMessage);
  chatHistory.push({ role: 'user', content: prompt });

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatHistory,
  });

  const responseMessage = chatCompletion.choices[0].message.content ?? 'No response';

  chatHistory.push({ role: 'assistant', content: responseMessage });
    
    const messagePrisma = await database.message.create({
        data: {
            role: chatHistory[chatHistory.length - 1].role,
            content: chatHistory[chatHistory.length - 1].content,
        },
    });

  return responseMessage;
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


export default {
    getChatByUsername,
    createChatResponse
};
