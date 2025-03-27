import { OpenAI } from 'openai';

import dotenv from 'dotenv';
import chatDb from '../repository/chat.db';

export const createChatResponse = async ({ prompt }: { prompt: string }): Promise<string> => {
  const chat = await chatDb.createChatResponse({ prompt });

  if (!chat) {
    throw new Error('Chat response not found.');
  }


  return chat;
};

export default {
    createChatResponse
}
