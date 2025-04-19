import express, { NextFunction, Request, Response } from 'express';
import voiceMessageService from '../service/voice/voiceMessage.service';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import ffmpeg from 'fluent-ffmpeg';

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

            const webmFilePath = path.join(audioFile.destination, `${audioFile.filename}.webm`);
            fs.renameSync(audioFile.path, webmFilePath);

            console.log(`audio file saved as: ${webmFilePath}`);

            // Convert webm to mp3
            const mp3FilePath = path.join(audioFile.destination, `${audioFile.filename}.mp3`);

            // Use ffmpeg to convert webm to mp3
            await new Promise<void>((resolve, reject) => {
                ffmpeg(webmFilePath)
                    .output(mp3FilePath)
                    .on('end', () => {
                        console.log(`Successfully converted to mp3: ${mp3FilePath}`);
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error('Error converting file:', err);
                        reject(err);
                    })
                    .run();
            });

            const result = await voiceMessageService.askVoiceMessage(
                { prompt: mp3FilePath }, // Pass the mp3 file path as the prompt
                { chatId: parseInt(chatId, 10) }, // Convert chatId to a number
                { username }
            );

            // Clean up both files when done
            fs.unlinkSync(webmFilePath);
            fs.unlinkSync(mp3FilePath);
            res.status(200).json({ response: result });
        } catch (error) {
            next(error);
        }
    }
);

export { voiceMessageRouter };
