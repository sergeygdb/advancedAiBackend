import { Chat as ChatPrisma } from '@prisma/client';

export class Chat {
    private id?: number;
    
    constructor(chat: { id?: number;}) {
        this.id = chat.id;
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