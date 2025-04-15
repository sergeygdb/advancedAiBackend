import { Message as MessagePrisma } from '@prisma/client';

export class Message {
    readonly id?: number;
    readonly prompt? : String;
    readonly content?: String
    readonly createdAt: Date = new Date();

    constructor(message: { id?: number; content: string;  prompt : string}) {
        this.id = message.id;
        this.content = message.content;
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

   

    static from({ id, content, prompt}: MessagePrisma) {
        return new Message({
            id,
            prompt,
            content, 
        });
    }
}