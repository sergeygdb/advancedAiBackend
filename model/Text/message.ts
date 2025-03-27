import { Message as MessagePrisma } from '@prisma/client';

export class Message {
    private id?: number;
    private content?: String
    private role?: String
    readonly createdAt: Date = new Date();

    constructor(message: { id?: number; content: string; role: string;}) {
        this.id = message.id;
        this.content = message.content;
        this.role = message.role;
    }

    setId(id: number) {
        this.id = id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    setContent(content: String) {
        this.content = content;
    }

    getContent(): String | undefined {
        return this.content;
    }

    setRole(role: String) {
        this.role = role;
    }

    getRole(): String | undefined {
        return this.role;
    }

    static from({ id, content, role}: MessagePrisma) {
        return new Message({
            id,
            content, 
            role
        });
    }
}