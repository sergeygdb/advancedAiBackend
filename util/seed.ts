import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    
    await prisma.mistake.deleteMany();
    await prisma.correction.deleteMany();
    await prisma.voiceMessage.deleteMany();
    await prisma.voiceChat.deleteMany();
    
    await prisma.user.deleteMany();
    
    // model User {
    //     id        Int         @id @default(autoincrement())
    //     username  String      @unique
    //     firstName String
    //     lastName  String
    //     email     String      @unique
    //     password  String
    //     chats     Chat[]      @relation("UserChats")
    //     VoiceChat VoiceChat[] @relation("UserVoiceChats")
    //     createdAt DateTime    @default(now())
    //   }
      
    //   model Chat {
    //     id        Int       @id @default(autoincrement())
    //     name      String    @default("Chat")
    //     user      User?     @relation("UserChats", fields: [userId], references: [id])
    //     userId    Int?
    //     messages  Message[] @relation("ChatMessages")
    //     createdAt DateTime  @default(now())
    //   }
      
    //   model Message {
    //     id        Int      @id @default(autoincrement())
    //     prompt    String
    //     content   String
    //     role      String
    //     chat      Chat?    @relation("ChatMessages", fields: [chatId], references: [id])
    //     chatId    Int?
    //     createdAt DateTime @default(now())
    //   }
      
    //   model VoiceChat {
    //     id        Int            @id @default(autoincrement())
    //     name      String         @default("VoiceChat")
    //     user      User?          @relation("UserVoiceChats", fields: [userId], references: [id])
    //     userId    Int?
    //     messages  VoiceMessage[] @relation("VoiceChatMessages")
    //     createdAt DateTime       @default(now())
    //   }
      
    //   model VoiceMessage {
    //     id         Int          @id @default(autoincrement())
    //     prompt     String
    //     content    String
    //     role       String
    //     chat       VoiceChat?   @relation("VoiceChatMessages", fields: [chatId], references: [id])
    //     chatId     Int?
    //     correction Correction[] @relation("VoiceMessageCorrection")
    //     createdAt  DateTime     @default(now())
    //   }
      
    //   model Correction {
    //     id             Int          @id @default(autoincrement())
    //     description    String
    //     mistakes       Mistake[]    @relation("VoiceMessageCorrectionMistakes")
    //     voiceMessage   VoiceMessage @relation("VoiceMessageCorrection", fields: [voiceMessageId], references: [id])
    //     voiceMessageId Int
    //     createdAt      DateTime     @default(now())
    //   }
      
    //   model Mistake {
    //     id           Int        @id @default(autoincrement())
    //     explanation  String
    //     correction   Correction @relation("VoiceMessageCorrectionMistakes", fields: [correctionId], references: [id])
    //     correctionId Int
    //     createdAt    DateTime   @default(now())
    //   }
    
    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin', 12),
            firstName: 'admin',
            lastName: 'admin',
            email: 'administration@ucll.be',
        },
    });
    
    const chat1 = await prisma.chat.create({
        data: {
            name: 'chat1',
            user: {
                connect: {
                    id: admin.id, 
                },
            },
        },
    });

    const voiceChat1 = await prisma.voiceChat.create({
        data: {
            name: 'voiceChat1',
            user: {
                connect: {
                    id: admin.id, 
                },
            },
        },
    });

    const voiceMessage1 = {
        prompt: "Je suis un étudiant.",
        role: "user",
        content: "true",
        correction: null,
        chatId: {
            connect: {
                id: voiceChat1.id,
            }
        }
      };

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
