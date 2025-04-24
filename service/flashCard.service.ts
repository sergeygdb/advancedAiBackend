import { FlashCard } from '../model/flashCard';
import flashcardDb from '../repository/flashcard.db';
import userDb from '../repository/user.db';
import { FlashCardInput } from '../types';

const getAllFlashcards = async (): Promise<FlashCard[]> => {
    const flashCards = await flashcardDb.getAllFlashcards();
    return flashCards;
};

const getUsersFlashcards = async (userId: number): Promise<FlashCard[]> => {
    const user = await userDb.getUserById({ id: userId });
    if (!user) {
        throw new Error(`User with id: ${userId} does not exist.`);
    }

    const flashCards = await flashcardDb.getUsersFlashcards(userId);
    return flashCards;
};

const createFlashcard = async (flashcard: FlashCardInput): Promise<FlashCard> => {
    const newFlashCard = await flashcardDb.createFlashcard(flashcard);
    return newFlashCard;
};

const flashCardService = {
    getAllFlashcards,
    getUsersFlashcards,
    createFlashcard,
};

export default flashCardService;
