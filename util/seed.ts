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

    // Corrected VoiceMessage creation
    const voiceMessage1 = await prisma.voiceMessage.create({
        data: {
            prompt: "Je suis un étudiant.",
            content: "true",
            chatId: voiceChat1.id, // Directly assign chatId as a number
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
