import * as bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { chatRouter } from './controller/chat.routes';
import { userRouter } from './controller/user.routes';
import { messageRouter } from './controller/message.routes';
import { expressjwt } from 'express-jwt';
import { voiceChatRouter } from './controller/voiceChat.routes';
import { voiceMessageRouter } from './controller/voiceMessage.routes';
import flashCardRouter from './controller/flashCard.route';
import {evaluateTextRouter} from './controller/evaluateText.routes';


const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

// app.use(
//     cors({
//         origin: [
//             'http://localhost:8080',
//             'https://fb76-91-180-30-217.ngrok-free.app',
//             'http://127.0.0.1:4040',
//         ],
//     })
// );
// use no cors
app.use(
    cors({
        origin: '*',
    })
);

app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/api-docs',
            /^\/api-docs\/.*/,
            '/user/login',
            '/user/register',
            '/status',
            '/chat/create',
            '/message/ask',
            '/voiceChat/create',
            '/voiceMessage/ask',
            '/voiceChat/all/username',
            /^\/voiceChat\/all\/messages\/.*$/,
            '/voiceChat/delete',
            '/evaluate/english'
        ],
    })
);

app.use('/user', userRouter);

app.use('/chat', chatRouter);

app.use('/message', messageRouter);

app.use('/voiceChat', voiceChatRouter);
app.use('/voiceMessage', voiceMessageRouter);

app.use('/flashcards', flashCardRouter);

app.use('/evaluate', evaluateTextRouter);


app.get('/status', (req, res) => {
    res.json({ message: 'Duolingo-ish API is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Duolingo-ish API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'CoursesError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});

app.listen(port || 3000, () => {
    console.log(`Duolingo-ish API is running on port ${port}.`);
});
