import express, { NextFunction, Request, Response } from 'express';
import voiceMessageService from '../service/voice/voiceMessage.service';
import multer from 'multer';
import fs from 'fs';
import path from 'path';


const voiceMessageRouter = express.Router();

const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory

voiceMessageRouter.post(
    '/ask',
    upload.single('audio'), // Handle the 'audio' file
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId, username } = req.body as { chatId: string; username: string };

            if (!chatId) {
                return res.status(400).json({ error: 'Chat ID is required.' });
            }

            console.log(`chatId: ${chatId}`);
            
            // Access the uploaded file
            const audioFile = req.file;

            if (!audioFile) {
                return res.status(400).json({ error: 'Audio file is required.' });
            }

            // Rename the file to have a .mp3 extension
            const newFilePath = path.join(audioFile.destination, `${audioFile.filename}.webm`);
            fs.renameSync(audioFile.path, newFilePath);

            console.log(`audio file saved as: ${newFilePath}`);


            const result = await voiceMessageService.askVoiceMessage(
                { prompt: newFilePath }, // Pass the new file path as the prompt
                { chatId: parseInt(chatId, 10) }, // Convert chatId to a number
                { username }
            );

-
            fs.unlinkSync(newFilePath);
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    }
);

export { voiceMessageRouter };

