import { OpenAI } from 'openai';
import database from '../util/database';
import chatDb from './chat.db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
  
  const maxWords = 30;
  
  const systemMessage = {
    role: 'system',
    content: `You are a helpful assistant who answers with only maximum ${maxWords} words. If you can't make a response with max ${maxWords} words, response with "ERROR: Response limit exceeded!". If you can't make a response but it's not because of the word limit, response with "ERROR: {Describe reason here}".`,
  };

  const askMessage = async (
    { prompt }: { prompt: string },
    { chat }: { chat?: number } = {}
  ): Promise<string> => {
      let chatHistory: any[] = [];
      chatHistory.unshift(systemMessage);
      chatHistory.push({ role: 'user', content: prompt });
  
      if (chat) {
        const chatResponse = await chatDb.getChatById({ id: chat });

        if (!chatResponse) {
          throw new Error('Chat not found.');
        }

        chatHistory = [];

        chatHistory.unshift(systemMessage);

        const chatMessages = await chatDb.getMessagesByChatId({ chatId: chat });

        chatMessages.forEach((message) => {
          chatHistory.push({ role: message.getRole(), content: message.getContent() });
        });

        chatHistory.push({ role: 'user', content: prompt });
      }

      const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: chatHistory,
      });
  
      const responseMessage = chatCompletion.choices[0].message.content ?? 'No response';
  
      chatHistory.push({ role: 'assistant', content: responseMessage });
  
      const messagePrisma = await database.message.create({
          data: {
              prompt: prompt,
              role: chatHistory[chatHistory.length - 1].role,
              content: chatHistory[chatHistory.length - 1].content,
              chat: chat
                  ? { connect: { id: chat } }
                  : undefined,
          },
      });
  
      return responseMessage;
  };

const messageDb = {
    askMessage,
};

export default messageDb;