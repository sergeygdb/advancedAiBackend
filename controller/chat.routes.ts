import express, { NextFunction, Request, Response } from 'express';
import  chatService  from '../service/text/chat.service';

const chatRouter = express.Router();

chatRouter.post('/create',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, name } = req.body;
            const result = await chatService.createChat({ username }, { name });
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    });


export { chatRouter };

