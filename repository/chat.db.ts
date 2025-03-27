import { Chat } from '../model/chat';
import database from '../util/database';


const getChatByUsername = async ({ username }: { username: string }): Promise<Chat | null> => {
    try {
        const chatPrisma = await database.chat.findFirst({
            where: {
                user: {
                    username: username,
                },
            },
            include: {
                messages: true,
            },
        });

        return chatPrisma ? Chat.from(chatPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


export default {
    getChatByUsername
};
