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

// voiceChatRouter.get('/get/:id',
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const id: number = parseInt(req.params.id, 10);
//             const result = await voiceChatService.getVoiceChatById(id);
//             res.status(200).json({ response: result });
//         } catch (error) {
//             next(error);
//         }
//     });

voiceChatRouter.get(`/all/username`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username: string = String(req.query.username);
        const result = await voiceChatService.getVoiceChatsByUsername(username);
        res.status(200).json({ response: result });
    } catch (error) {
        next(error);
    }
});


voiceChatRouter.delete(`/delete`, async (req: Request, res: Response, next: NextFunction) => {
    try {

        let id: string = String(req.query.id);
        const idNumber  = parseInt(id, 10);


        const result = await voiceChatService.deleteVoiceMessagesByVoiceChatId(idNumber);
        res.status(200).json({ response: result });
    } catch (error) {
        next(error);
    }
});

voiceChatRouter.get(`/all/messages/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = parseInt(req.params.id, 10);
        const result = await voiceChatService.getVoiceMessagesByVoiceChatId(id);
        res.status(200).json({ response: result });
    } catch (error) {
        next(error);
    }
});
    

export { voiceChatRouter };