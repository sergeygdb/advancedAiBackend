import { Flashcard } from '@prisma/client';
import { User } from '../model/user';
import { FlashCardInput, RegisterUser } from '../types';
import database from '../util/database';
import { FlashCard } from '../model/flashCard';

// import { Flashcard as FlashCardPrisma } from '@prisma/client';
// import { User } from './user';

// export class FlashCard {
//     readonly id?: number;
//     readonly userId?: number;
//     readonly question: string;
//     readonly topic: string;
//     readonly answer: string;
//     readonly createdAt: Date;

//     constructor(flashCard: {
//         id?: number;
//         userId?: number;
//         question: string;
//         answer: string;
//         topic: string;
//         createdAt?: Date;
//     }) {
//         this.validate(flashCard);

//         this.id = flashCard.id;
//         this.userId = flashCard.userId;
//         this.question = flashCard.question;
//         this.answer = flashCard.answer;
//         this.topic = flashCard.topic;
//         this.createdAt = flashCard.createdAt || new Date();
//     }

//     static from(flashCard: FlashCardPrisma): FlashCard {
//         return new FlashCard({
//             id: flashCard.id ?? undefined,
//             userId: flashCard.userId ?? undefined,
//             question: flashCard.question,
//             answer: flashCard.answer,
//             topic: flashCard.topic,
//             createdAt: flashCard.createdAt,
//         });
//     }

//     getId(): number | undefined {
//         return this.id;
//     }

//     getUserId(): number | undefined {
//         return this.userId;
//     }

//     getQuestion(): string {
//         return this.question;
//     }

//     getAnswer(): string {
//         return this.answer;
//     }

//     getCreatedAt(): Date {
//         return this.createdAt;
//     }

//     getTopic(): string {
//         return this.topic;
//     }

//     private validate(flashCard: { question: string; answer: string }) {
//         if (!flashCard.question) {
//             throw new Error('Question is required');
//         }
//         if (!flashCard.answer) {
//             throw new Error('Answer is required');
//         }
//     }
// }

const getAllFlashcards = async (): Promise<FlashCard[]> => {
    try {
        const flashcardsPrisma = await database.flashcard.findMany({});

        return flashcardsPrisma.map((flashcard) => FlashCard.from(flashcard));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUsersFlashcards = async (userId: number): Promise<FlashCard[]> => {
    try {
        const flashcardsPrisma = await database.flashcard.findMany({
            where: { userId },
        });

        return flashcardsPrisma.map((flashcard) => FlashCard.from(flashcard));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createFlashcard = async (flashcard: FlashCardInput): Promise<FlashCard> => {
    if (!flashcard) {
        throw new Error('Flashcard is undefined');
    }

    try {
        const flashcardPrisma = await database.flashcard.create({
            data: {
                question: flashcard.question,
                answer: flashcard.answer,
                topic: flashcard.topic,
                userId: flashcard.userId,
            },
        });

        return FlashCard.from(flashcardPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const flashcardDb = {
    getAllFlashcards,
    getUsersFlashcards,
    createFlashcard,
};

export default flashcardDb;
