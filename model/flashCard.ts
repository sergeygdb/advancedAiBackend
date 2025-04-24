import { Flashcard as FlashCardPrisma } from '@prisma/client';
import { User } from './user';

export class FlashCard {
    readonly id?: number;
    readonly userId?: number;
    readonly question: string;
    readonly topic: string;
    readonly answer: string;
    readonly createdAt: Date;

    constructor(flashCard: {
        id?: number;
        userId?: number;
        question: string;
        answer: string;
        topic: string;
        createdAt?: Date;
    }) {
        this.validate(flashCard);

        this.id = flashCard.id;
        this.userId = flashCard.userId;
        this.question = flashCard.question;
        this.answer = flashCard.answer;
        this.topic = flashCard.topic;
        this.createdAt = flashCard.createdAt || new Date();
    }

    static from(flashCard: FlashCardPrisma): FlashCard {
        return new FlashCard({
            id: flashCard.id ?? undefined,
            userId: flashCard.userId ?? undefined,
            question: flashCard.question,
            answer: flashCard.answer,
            topic: flashCard.topic,
            createdAt: flashCard.createdAt,
        });
    }

    getId(): number | undefined {
        return this.id;
    }

    getUserId(): number | undefined {
        return this.userId;
    }

    getQuestion(): string {
        return this.question;
    }

    getAnswer(): string {
        return this.answer;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getTopic(): string {
        return this.topic;
    }

    private validate(flashCard: { question: string; answer: string }) {
        if (!flashCard.question) {
            throw new Error('Question is required');
        }
        if (!flashCard.answer) {
            throw new Error('Answer is required');
        }
    }
}
