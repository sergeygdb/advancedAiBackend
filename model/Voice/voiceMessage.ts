import { VoiceMessage as VoiceMessagePrisma } from '@prisma/client';

export class VoiceMessage {
    private id?: number;
    private content?: String
    private role?: String
    
    constructor(voiceMessage: { id?: number; content: string; role: string;}) {
        this.id = voiceMessage.id;
        this.content = voiceMessage.content;
        this.role = voiceMessage.role;

    }

    setId(id: number) {
        this.id = id;
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

    static from({ id, content, role}: VoiceMessagePrisma) {
        return new VoiceMessage({
            id,
            content, 
            role
        });
    }
}