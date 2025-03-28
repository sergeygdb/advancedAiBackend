
import { UnauthorizedError } from 'express-jwt/dist/errors/UnauthorizedError';
import messageDb from '../../repository/Text/message.db';

export const askMessage = async ({ prompt }: { prompt: string }, {chatId} : { chatId?:number}, { username } : { username : string }): Promise<string> => {
  
  // if (!username) {
  //   throw new UnauthorizedError("credentials_required", { message: "User not authenticated!" });
  // }
  
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
