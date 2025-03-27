import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    
    await prisma.user.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.message.deleteMany();

    // model User {
    //     id        Int         @id @default(autoincrement())
    //     username  String      @unique
    //     firstName String
    //     lastName  String
    //     email     String      @unique
    //     password  String
    //     chats     Chat[]      @relation("UserChats")
    //     VoiceChat VoiceChat[] @relation("UserVoiceChats")
    //   }
      
    //   model Chat {
    //     id       Int       @id @default(autoincrement())
    //     user     User?     @relation("UserChats", fields: [userId], references: [id])
    //     userId   Int?
    //     messages Message[] @relation("ChatMessages")
    //   }
      
    //   model Message {
    //     id      Int    @id @default(autoincrement())
    //     content String
    //     prompt  String
    //     role    String
    //     chat    Chat?  @relation("ChatMessages", fields: [chatId], references: [id])
    //     chatId  Int?
    //   }
      
    //   model VoiceChat {
    //     id       Int            @id @default(autoincrement())
    //     user     User?          @relation("UserVoiceChats", fields: [userId], references: [id])
    //     userId   Int?
    //     messages VoiceMessage[] @relation("VoiceChatMessages")
    //   }
      
    //   model VoiceMessage {
    //     id      Int        @id @default(autoincrement())
    //     content String
    //     role    String
    //     chat    VoiceChat? @relation("VoiceChatMessages", fields: [chatId], references: [id])
    //     chatId  Int?
    //   }

    const chat1 = await prisma.chat.create({
        data: {
            name: 'chat1',
            id: 1,
        },
    });

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin', 12),
            firstName: 'admin',
            lastName: 'admin',
            email: 'administration@ucll.be',
        },
    });

};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
