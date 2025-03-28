import { Mistake as MistakePrisma } from '@prisma/client';

export class Mistake {
    private id?: number;
    // readonly explanation: { [key: string]: string } = {};
    readonly problematicWord?: string;
    readonly explanation?: string;
    readonly createdAt: Date;
    readonly brokeSubject? : boolean = false;

    // constructor(mistake: { id?: number; explanation?: { [key: string]: string }; createdAt: Date }) {
    constructor(mistake: { id?: number; problematicWord?: string, explanation? : string; createdAt: Date, brokeSubject? : boolean }) {
        this.id = mistake.id;
        // this.explanation = mistake.explanation || {};
        this.problematicWord = mistake.problematicWord;
        this.explanation = mistake.explanation;
        this.createdAt = mistake.createdAt;
        this.brokeSubject = mistake.brokeSubject;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    getProblematicWord(): string | undefined {
        return this.problematicWord;
    }

    getExplanation(): string | undefined {
        return this.explanation;
    }

    getBrokeSubject(): boolean | undefined {
        return this.brokeSubject;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static from(data: MistakePrisma): Mistake {
        return new Mistake({
            id: data.id,
            problematicWord: data.problematicWord,
            explanation: data.explanation,
            brokeSubject: data.brokeSubject,
            createdAt: data.createdAt,
        });
    }
}