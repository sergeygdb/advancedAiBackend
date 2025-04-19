import chatDb from '../../repository/Text/chat.db';

const createChat = async ({ username }: { username: string }, { name }: { name?: string }) => {
    try {
        const chat = await chatDb.createChat({ username }, { name });

        if (!chat) {
            throw new Error("Couldn't create chat.");
        }

        return chat;
    } catch (error) {
        console.error(error);
        throw new Error("Couldn't create chat.");
    }
};

const getChatsByUsername = async ({ username }: { username: string }) => {
    try {
        const chats = await chatDb.getChatsByUsername({ username });

        if (!chats) {
            throw new Error("Couldn't get chats.");
        }

        return chats;
    } catch (error) {
        console.error(error);
        throw new Error("Couldn't get chats.");
    }
};

const chatService = {
    createChat,
    getChatsByUsername,
};

export default chatService;
