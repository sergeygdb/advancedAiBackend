import { Message as MessagePrisma } from '@prisma/client';

export class Message {
    readonly id?: number;
    readonly prompt? : String;
    readonly content?: String
    readonly role?: String
    readonly createdAt: Date = new Date();

    constructor(message: { id?: number; content: string; role: string; prompt : string}) {
        this.id = message.id;
        this.content = message.content;
        this.role = message.role;
        this.prompt = message.prompt;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getPrompt(): String | undefined {
        return this.prompt;
    }

    getContent(): String | undefined {
        return this.content;
    }

    getRole(): String | undefined {
        return this.role;
    }

    static from({ id, content, role, prompt}: MessagePrisma) {
        return new Message({
            id,
            prompt,
            content, 
            role,
        });
    }
}