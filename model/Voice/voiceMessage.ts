import { VoiceMessage as VoiceMessagePrisma } from '@prisma/client';
import { Correction } from './correction';
import { Correction as CorrectionPrisma } from '@prisma/client';
import { Mistake as MistakePrisma } from '@prisma/client';

export class VoiceMessage {
    private id?: number;
    readonly prompt?: string;
    private content?: string;
    readonly correction?: Correction[];
    private role?: string;
    readonly createdAt: Date = new Date();
    
    constructor(voiceMessage: { id?: number; content: string; role: string; prompt: string; correction?: Correction[] }) {
        this.id = voiceMessage.id;
        this.content = voiceMessage.content;
        this.role = voiceMessage.role;
        this.prompt = voiceMessage.prompt;
        this.correction = voiceMessage.correction;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    setContent(content: string) {
        this.content = content;
    }

    getContent(): string | undefined {
        return this.content;
    }

    getCorrection(): Correction[] | undefined {
        return this.correction;
    }

    setRole(role: string) {
        this.role = role;
    }

    getRole(): string | undefined {
        return this.role;
    }

    getPrompt(): string | undefined {
        return this.prompt;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static from(data: VoiceMessagePrisma & { correction: (CorrectionPrisma & { mistakes: MistakePrisma[] })[] }): VoiceMessage {
        return new VoiceMessage({
            id: data.id,
            content: data.content,
            role: data.role,
            prompt: data.prompt,
            correction: data.correction.map((corr) => Correction.from(corr)),
        });
    }
}