import { OpenAI } from 'openai';
import database from '../util/database';
import chatDb from './chat.db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
  
  const maxWords = 6;
  
  const systemMessage = {
    role: 'system',
    // content: `You are a helpful assistant who answers!`,
    content: `You are a helpful assistant who answers with only maximum ${maxWords} words. If you can't make a response with max ${maxWords} words, response with "ERROR: Response limit exceeded!". If you can't make a response but it's not because of the word limit, response with "ERROR: {Describe reason here}".`,
  };

  const askMessage = async (
    { prompt }: { prompt: string },
    { chat }: { chat?: number } = {}
): Promise<string> => {
    let chatHistory: any[] = [];

    // Add the system message to the chat history
    chatHistory.push(systemMessage);

    if (chat) {
        const chatResponse = await chatDb.getChatById({ id: chat });

        if (!chatResponse) {
            throw new Error('Chat not found.');
        }

        const chatMessages = await chatDb.getMessagesByChatId({ chatId: chat });

        // Add previous messages to the chat history
        chatMessages.forEach((message) => {
            chatHistory.push({ role: "user", content: message.prompt });
            chatHistory.push({ role: message.role, content: message.content });
        });
    }

    // Append the new user prompt
    chatHistory.push({ role: 'user', content: prompt });

    console.log(chatHistory);

    // Send the structured input to the OpenAI API
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatHistory,
    });

    const responseMessage = chatCompletion.choices[0].message.content ?? 'No response';

    // Add the assistant's response to the chat history
    chatHistory.push({ role: 'assistant', content: responseMessage });

    // Save the message to the database
    const messagePrisma = await database.message.create({
        data: {
            prompt: prompt,
            role: "assistant",
            content: responseMessage,
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