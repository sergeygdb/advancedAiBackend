
import { UnauthorizedError } from 'express-jwt/dist/errors/UnauthorizedError';
import voiceMessageDb from '../../repository/Voice/voiceMessage.db';

const askVoiceMessage = async ({ prompt }: { prompt: string }, {chatId} : { chatId?:number}, { username } : { username : string }): Promise<string> => {
  
  // if (!username) {
  //   throw new UnauthorizedError("credentials_required", { message: "User not authenticated!" });
  // }

  if (!chatId) {  
    console.log(`${chatId}`);
    throw new Error('Chat ID is required.');
  }
  
  const chat = await voiceMessageDb.askVoiceMessage(prompt, chatId);

  if (!chat) {
    throw new Error('Chat response not found.');
  }


  return chat;
};

const voiceMessageService = {
    askVoiceMessage
};

export default voiceMessageService;
