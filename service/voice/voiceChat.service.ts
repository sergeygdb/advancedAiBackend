
import { VoiceMessage } from '../../model/Voice/voiceMessage';
import messageDb from '../../repository/Voice/voiceMessage.db';

import voiceChatDb from '../../repository/Voice/voiceChat.db';
import { VoiceChat } from '../../model/Voice/voicechat';

const createVoiceChat = async ({username} : {username : string}, {name} : {name? : string}, {language} : {language : string}) => {
  try {
    const chat = await voiceChatDb.createVoiceChat({username}, {name}, {language});

    if (!chat) {
      throw new Error('Couldn\'t create chat.');
    }

    messageDb.createFirstMessage(chat.getId() as number, language as string)

    return chat;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t create chat.');
  }
};


const getVoiceChatById = async (id:number ) => {
  try {
    const chat = await voiceChatDb.getVoiceChatById({id});

    if (!chat) {
      throw new Error('Couldn\'t get chat.');
    }

    return chat;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t get chat.');
  }
};


const getVoiceChatsByUsername = async (username:string ) => {
  try {
    const chat = await voiceChatDb.getVoiceChatsByUsername(username);

    if (!chat) {
      throw new Error('Couldn\'t get chats.');
    }

    return chat;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t get chats.');
  }
};


const getVoiceMessagesByVoiceChatId = async (chatid: number): Promise<VoiceMessage[]> => {
  try {
    const messages = await voiceChatDb.getVoiceMessagesByVoiceChatId(chatid);

    if (!messages) {
      throw new Error('Couldn\'t get messages.');
    }

    return messages;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t get chats.');
  }
};


const deleteVoiceMessagesByVoiceChatId = async (chatid: number): Promise<VoiceChat> => {

  try {
    const chat = await voiceChatDb.deleteVoiceMessagesByVoiceChatId(chatid);

    if (!chat) {
      throw new Error('Couldn\'t get messages.');
    }

    return chat;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t get chats.');
  }
};

const voiceChatService = {
  createVoiceChat,
  getVoiceChatById,
  getVoiceChatsByUsername,
  getVoiceMessagesByVoiceChatId,
  deleteVoiceMessagesByVoiceChatId
  
};

export default voiceChatService;
