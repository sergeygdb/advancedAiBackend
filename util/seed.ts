// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    // await prisma.schedule.deleteMany();
    // await prisma.course.deleteMany();
    // await prisma.lecturer.deleteMany({});
    await prisma.user.deleteMany();

    // const fullStack = await prisma.course.create({
    //     data: {
    //         name: 'Full-stack development',
    //         description: 'Learn how to build a full stack web application.',
    //         phase: 2,
    //         credits: 6,
    //     },
    // });

    // const softwareEngineering = await prisma.course.create({
    //     data: {
    //         name: 'Software Engineering',
    //         description: 'Learn how to build and deploy a software application.',
    //         phase: 2,
    //         credits: 6,
    //     },
    // });

    // const frontEnd = await prisma.course.create({
    //     data: {
    //         name: 'Front-end Development',
    //         description: 'Learn how to build a front-end web application.',
    //         phase: 1,
    //         credits: 6,
    //     },
    // });

    // const backEnd = await prisma.course.create({
    //     data: {
    //         name: 'Back-end Development',
    //         description: 'Learn how to build a REST-API in a back-end application.',
    //         phase: 1,
    //         credits: 6,
    //     },
    // });

    // const admin = await prisma.user.create({
    //     data: {
    //         username: 'admin',
    //         password: 'admin123',
    //         firstName: 'admin',
    //         lastName: '',
    //         email: 'administration@ucll.be',
    //     },
    // });

    // const lecturerJP = await prisma.lecturer.create({
    //     data: {
    //         expertise: 'Full-stack development, Front-end development',
    //         user: {
    //             create: {
    //                 username: 'johanp',
    //                 password: 'johanp123',
    //                 firstName: 'Johan',
    //                 lastName: 'Pieck',
    //                 email: 'johan.pieck@ucll.be',
    //             },
    //         },
    //         courses: {
    //             connect: [{ id: fullStack.id }, { id: frontEnd.id }],
    //         },
    //     },
    // });

    // const lecturerES = await prisma.lecturer.create({
    //     data: {
    //         expertise: 'Software Engineering, Back-end Development',
    //         user: {
    //             create: {
    //                 username: 'elkes',
    //                 password: 'elkes123',
    //                 firstName: 'Elke',
    //                 lastName: 'Steegmans',
    //                 email: 'elke.steegmans@ucll.be',
    //             },
    //         },
    //         courses: {
    //             connect: [{ id: fullStack.id }, { id: softwareEngineering.id }],
    //         },
    //     },
    // });

    // const lecturerGJ = await prisma.lecturer.create({
    //     data: {
    //         expertise: 'Full-stack development, Back-end Development',
    //         user: {
    //             create: {
    //                 username: 'greetjej',
    //                 password: await bcrypt.hash('greetjej123', 12),
    //                 firstName: 'Greetje',
    //                 lastName: 'Jongen',
    //                 email: 'greetje.jongen@ucll.be',
    //             },
    //         },
    //         courses: {
    //             connect: [{ id: fullStack.id }, { id: backEnd.id }],
    //         },
    //     },
    // });

    // await prisma.schedule.create({
    //     data: {
    //         start: set(new Date(), { hours: 8, minutes: 30 }),
    //         end: set(new Date(), { hours: 10, minutes: 30 }),
    //         course: {
    //             connect: { id: fullStack.id },
    //         },
    //     },
    // });

    // await prisma.schedule.create({
    //     data: {
    //         start: set(new Date(), { hours: 13, minutes: 30 }),
    //         end: set(new Date(), { hours: 15, minutes: 30 }),
    //         course: {
    //             connect: { id: fullStack.id },
    //         },
    //     },
    // });

    // await prisma.schedule.create({
    //     data: {
    //         start: set(new Date(), { hours: 13, minutes: 30 }),
    //         end: set(new Date(), { hours: 15, minutes: 30 }),
    //         course: {
    //             connect: { id: softwareEngineering.id },
    //         },
    //     },
    // });

    // await prisma.schedule.create({
    //     data: {
    //         start: set(new Date(), { hours: 10, minutes: 45 }),
    //         end: set(new Date(), { hours: 12, minutes: 45 }),
    //         course: {
    //             connect: { id: backEnd.id },
    //         },
    //     },
    // });
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
