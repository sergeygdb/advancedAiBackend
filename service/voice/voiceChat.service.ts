
import chatDb from '../../repository/Text/chat.db';
import voiceChatDb from '../../repository/Voice/voiceChat.db';

const createVoiceChat = async ({username} : {username : string}, {name} : {name? : string}) => {
  try {
    const chat = await voiceChatDb.createVoiceChat({username}, {name});

    if (!chat) {
      throw new Error('Couldn\'t create chat.');
    }

    return chat;

  }
  catch (error) {
    console.error(error);
    throw new Error('Couldn\'t create chat.');
  }
};

const voiceChatService = {
  createVoiceChat,
};

export default voiceChatService;
