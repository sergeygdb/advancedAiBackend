import express, { NextFunction, Request, Response } from 'express';
import evaluateTextService from '../service/evaluateText.service';

const evaluateTextRouter = express.Router();

evaluateTextRouter.post('/english',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const text  = req.body.text;
            const result = await evaluateTextService.evaluateText(text);
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
});

export { evaluateTextRouter };