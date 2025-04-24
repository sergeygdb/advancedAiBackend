import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/text/message.service';
import flashCardService from '../service/flashCard.service';

const flashCardRouter = express.Router();

flashCardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const flashCards = await flashCardService.getAllFlashcards();
        res.status(200).json(flashCards);
    } catch (error) {
        next(error);
    }
});

flashCardRouter.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth } = req as Request & { auth: { username: string; id: string } };

        const { userId } = req.params;

        const flashCards = await flashCardService.getUsersFlashcards(Number(userId));
        res.status(200).json(flashCards);
    } catch (error) {
        next(error);
    }
});

flashCardRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, question, answer, topic } = req.body;
        const flashCard = await flashCardService.createFlashcard({
            userId,
            question,
            answer,
            topic,
        });
        res.status(201).json(flashCard);
    } catch (error) {
        next(error);
    }
});

export default flashCardRouter;
