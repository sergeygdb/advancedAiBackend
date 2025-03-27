
import chatDb from '../repository/chat.db';

const createChat = async ({username} : {username : string}, {name} : {name? : string}) => {
  try {
    const chat = await chatDb.createChat({username}, {name});

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

const chatService = {
  createChat,
};

export default chatService;
