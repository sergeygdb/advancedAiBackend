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
    await prisma.flashcard.deleteMany();

    const admin = await prisma.user.create({
        data: {
            id: 1,
            username: 'admin',
            password: await bcrypt.hash('admin', 12),
            firstName: 'admin',
            lastName: 'admin',
            email: 'administration@ucll.be',
        },
    });


    



    // Corrected VoiceMessage creation

    const flashCard1 = await prisma.flashcard.create({
        data: {
            question: 'What is the capital of France?',
            answer: 'Paris',
            topic: 'Geography',
            userId: admin.id,
        },
    });

    const flashCard2 = await prisma.flashcard.create({
        data: {
            question: 'What is the capital of Germany?',
            answer: 'Berlin',
            topic: 'Geography',
            userId: admin.id,
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
