import { VoiceChat as VoiceChatPrisma } from '@prisma/client';


export class VoiceChat {
    private id?: number;
    
    constructor(conversation: { id?: number;}) {
        this.id = conversation.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getId(): number | undefined {
        return this.id;
    }

    static from({ id}: VoiceChatPrisma) {
        return new VoiceChat({
            id
        });
    }
}