import { VoiceChat as VoiceChatPrisma } from '@prisma/client';


export class VoiceChat {
    private id?: number;
    private name?: String;
    private createdAt?: Date;
    

    
    constructor(conversation: { id?: number;name?: String;createdAt?: Date }) {
        this.id = conversation.id;
        this.name = conversation.name;
        this.createdAt = conversation.createdAt;


    }

    setId(id: number) {
        this.id = id;
    }

    getName(): String | undefined {
        return this.name;
    }

    getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    static from({ id, name, createdAt}: VoiceChatPrisma) {
        return new VoiceChat({
            id,
            name,
            createdAt
        });
    }
}