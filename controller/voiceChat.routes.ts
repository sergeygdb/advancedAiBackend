import express, { NextFunction, Request, Response } from 'express';
import voiceChatService from '../service/voice/voiceChat.service';

const voiceChatRouter = express.Router();

voiceChatRouter.post('/create',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, name } = req.body;
            const result = await voiceChatService.createVoiceChat({ username }, { name });
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    });

export { voiceChatRouter };

