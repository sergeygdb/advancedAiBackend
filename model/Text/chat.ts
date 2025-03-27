import { Chat as ChatPrisma } from '@prisma/client';

export class Chat {
    private id?: number;
    readonly createdAt: Date = new Date();
    
    constructor(chat: { id?: number;}) {
        this.id = chat.id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    static from({ id}: ChatPrisma) {
        return new Chat({
            id
        });
    }
}