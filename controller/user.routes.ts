import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types/index';

const userRouter = express.Router();

// userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userInput = <UserInput>req.body;
//         const response = await userService.register(userInput);
//         res.status(200).json(response);
//     }
//     catch (error) {
//         next(error);
//     }
// });

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication succesful', ...response });
    } catch (error) {
        next(error);
    }
});

userRouter.post('/chats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.query as { username: string };
        const response = await userService.getUserChats({ username });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export { userRouter };
