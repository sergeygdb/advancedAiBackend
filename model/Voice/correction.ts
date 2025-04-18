import { Correction as CorrectionPrisma, Mistake as MistakePrisma } from '@prisma/client';
import { Mistake } from './mistake';

export class Correction {
    private id?: number;
    readonly description: string;
    readonly mistakes: Mistake[];
    readonly isCorrectSentence: boolean;
    readonly correctionOfEntireSentence: string;

    readonly createdAt: Date = new Date();
    
    constructor(correction: { id?: number; description: string; isCorrectSentence: boolean; correctionOfEntireSentence: string; mistakes: Mistake[]; }) {
        this.id = correction.id;
        this.description = correction.description;
        this.isCorrectSentence = correction.isCorrectSentence
        this.correctionOfEntireSentence = correction.correctionOfEntireSentence;
        this.mistakes = correction.mistakes;

    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    getDescription(): string {
        return this.description;
    }

    getMistakes(): Mistake[] {
        return this.mistakes;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static from(data: CorrectionPrisma & { mistakes: MistakePrisma[] }): Correction {
        return new Correction({
            id: data.id,
            description: data.description,
            isCorrectSentence: data.isCorrectSentence,
            correctionOfEntireSentence: data.correctionOfEntireSentence,
            mistakes: data.mistakes.map((mistake) => Mistake.from(mistake)),
        });
    }
}