import express, { NextFunction, Request, Response } from 'express';
import { createChatResponse } from '../service/chat.service';

const chatRouter = express.Router();

chatRouter.post('/ask',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { prompt } = req.body;

         

            const result = await createChatResponse({ prompt });
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    });

export { chatRouter };
