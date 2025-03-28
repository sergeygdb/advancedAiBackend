import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';

const messageRouter = express.Router();

messageRouter.post('/ask',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {username} = req.body as { username: string };
            const { prompt, chatId } = req.body;
            const result = await messageService.askMessage({ prompt }, { chatId }, { username });
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    });

export { messageRouter };

