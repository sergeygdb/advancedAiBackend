
import messageDb from '../repository/message.db';

export const askMessage = async ({ prompt }: { prompt: string }, {chatId} : { chatId?:number}): Promise<string> => {
  const chat = await messageDb.askMessage({ prompt }, { chat: chatId });

  if (!chat) {
    throw new Error('Chat response not found.');
  }


  return chat;
};

const messageService = {
    askMessage
};

export default messageService;
