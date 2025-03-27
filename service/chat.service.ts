import { OpenAI } from 'openai';

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemMessage = {
  role: 'system',
  content: 'You are a helpful assistant who answers with only maximum 3 words',
};

export const createChatResponse = async ({ prompt }: { prompt: string }): Promise<string> => {
    let chatHistory: any[] = [];
    chatHistory.unshift(systemMessage);
  chatHistory.push({ role: 'user', content: prompt });

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatHistory,
  });

  const responseMessage = chatCompletion.choices[0].message.content ?? 'No response';

  chatHistory.push({ role: 'assistant', content: responseMessage });

  return responseMessage;
};
