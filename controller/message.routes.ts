import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';

const messageRouter = express.Router();

messageRouter.post('/ask',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { prompt, chatId } = req.body;
            const result = await messageService.askMessage({ prompt }, { chatId });
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    });

export { messageRouter };

