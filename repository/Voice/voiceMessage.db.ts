import { OpenAI } from 'openai';
import voiceChatDb from './voiceChat.db';
import database from '../../util/database';
import fs from "fs";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
  
  const maxWords = 6;

  // system message in french
  const systemMessageFrench = {
    role: 'system',
    content: `You are a language assistant specialized in French grammar. Your task is to analyze a sentence provided by the user and identify any grammatical errors, including but not limited to errors in gender agreement, article usage, spelling, and syntax.
  Never forget about what the conversation is about, for example. Only ever actively grade and repond to the latest message from the user in the message context.

  In your response, return a JSON object (as response.choices[0].message.content) that strictly follows this format:
  
  {
    userSentence: {the exact sentence provided by the user},
    followupQuestion: {a relevant follow-up question in French to continue the conversation},
    correction: {
        correctSentence: true or false,  // false if any error is detected
        descriptionOfAllMistakes: {a short description of the mistake types (e.g., "gender agreement", "spelling", "punctuation")},
        correctionOfEntireSentence: {if errors were found, provide the fully corrected sentence; if the sentence is correct, leave empty},
        mistakesMade: [
            {
                problematicWord: "une chatte" // the word or phrase that contains the mistake,
                explanation: "If referring to a male cat, use 'un chat' because 'chat' is masculine."  // for each mistake, provide a detailed explanation
                brokeSubject: false // if user has responded with a sentence that is correct but not relevant to the conversation, set this to true, consider it a mistake
                },
            {
                problematicWord: "l'esthétiste", // "je lis des tests, j'aime pas trop." mistook "lis des tests" for "l'esthétiste"
                explanation: "Started a new conversation. If this is a mistake, retry" //Keep explanation short like this in case of broken subject!
                brokeSubject: true
            }
            // Include an entry for each detected mistake
        ]
    }
  }
  
  Important: Even if the sentence appears superficially correct, check all details. For instance, if the user says "Je vois une chatte." but the intended meaning is to refer to a male cat, you must mark it as incorrect by setting "correctSentence" to false, provide the corrected sentence (e.g., "Je vois un chat."), and include an explanation about the error in gender agreement.
  `
  };

  // system message in english
  const systemMessageEnglish = {
    role: 'system',
    content: `You are a language assistant specialized in English grammar. Your task is to analyze a sentence provided by the user and identify any grammatical errors, including but not limited to errors in gender agreement, article usage, spelling, and syntax.
  Never forget about what the conversation is about, for example. Only ever actively grade and repond to the latest message from the user in the message context.

  In your response, return a JSON object (as response.choices[0].message.content) that strictly follows this format:
  
  {
    userSentence: {the exact sentence provided by the user},
    followupQuestion: {a relevant follow-up question in English to continue the conversation},
    correction: {
        correctSentence: true or false,  // false if any error is detected
        descriptionOfAllMistakes: {a short description of the mistake types (e.g., "gender agreement", "spelling", "punctuation")},
        correctionOfEntireSentence: {if errors were found, provide the fully corrected sentence; if the sentence is correct, leave empty},
        mistakesMade: [
            {
              problematicWord: "a apple", // English grammar mistake
              explanation: "Use 'an' before words that start with a vowel sound, like 'an apple'.",
              brokeSubject: false // if user has responded with a sentence that is correct but not relevant to the conversation, set this to true, consider it a mistake
            },
            {
                problematicWord: "",
                explanation: "Started a new conversation. If this is a mistake, retry" //Keep explanation short like this in case of broken subject!
                brokeSubject: true
            }
            // Include an entry for each detected mistake
        ]
    }
  }
  
  Important: Even if the sentence appears superficially correct, check all details. For instance, if the user says "Je vois une chatte." but the intended meaning is to refer to a male cat, you must mark it as incorrect by setting "correctSentence" to false, provide the corrected sentence (e.g., "Je vois un chat."), and include an explanation about the error in gender agreement.
  `
  };

  // system message in dutch
  const systemMessageDutch = {
    role: 'system',
    content: `You are a language assistant specialized in Dutch grammar. Your task is to analyze a sentence provided by the user and identify any grammatical errors, including but not limited to errors in gender agreement, article usage, spelling, and syntax.
  Never forget about what the conversation is about, for example. Only ever actively grade and repond to the latest message from the user in the message context.

  In your response, return a JSON object (as response.choices[0].message.content) that strictly follows this format:
  
  {
    userSentence: {the exact sentence provided by the user},
    followupQuestion: {a relevant follow-up question in Dutch to continue the conversation},
    correction: {
        correctSentence: true or false,  // false if any error is detected
        descriptionOfAllMistakes: {a short description of the mistake types (e.g., "gender agreement", "spelling", "punctuation")},
        correctionOfEntireSentence: {if errors were found, provide the fully corrected sentence; if the sentence is correct, leave empty},
        mistakesMade: [
            {
                problematicWord: "heeft" // the word or phrase that contains the mistake,
                explanation: "Use 'heb' met 'ik': 'Ik heb een boek', not 'Ik heeft'."  // for each mistake, provide a detailed explanation
                brokeSubject: false // if user has responded with a sentence that is correct but not relevant to the conversation, set this to true, consider it a mistake
                },
            {
                problematicWord: "",
                explanation: "Started a new conversation. If this is a mistake, retry" //Keep explanation short like this in case of broken subject!
                brokeSubject: true
            }
            // Include an entry for each detected mistake
        ]
    }
  }
  
  Important: Even if the sentence appears superficially correct, check all details. For instance, if the user says "Je vois une chatte." but the intended meaning is to refer to a male cat, you must mark it as incorrect by setting "correctSentence" to false, provide the corrected sentence (e.g., "Je vois un chat."), and include an explanation about the error in gender agreement.
  `
  };

  
  
  const askVoiceMessage = async (audio: any, voiceChatId: number): Promise<any> => {

    let language: string | null = await voiceChatDb.getLanguageById(voiceChatId)

    console.log("language of the conversation  :"+language)
  
    let languageArgumentTranscription: string = '';
    let systemMessage
    let transcriptionPrompt: string = '';


    if (language==='French'){
      languageArgumentTranscription='fr';
    // system message for prompt message for French
      transcriptionPrompt='Transcrit chaque mot et erreur exactement comme ils sont prononcés, sans corrections ni ajustements. Merci de capturer chaque détail parlé fidèlement. Exemple : Je vois une chat.';
      systemMessage=systemMessageFrench;
    }
    else if (language==='Dutch'){
      languageArgumentTranscription='nl';
    // system message for prompt message for Dutch
      transcriptionPrompt='Transcribeer elk woord en elke fout precies zoals ze uitgesproken worden, zonder correcties of aanpassingen. Gelieve elk gesproken detail getrouw vast te leggen. Voorbeeld: Ik zie kat.';
      systemMessage=systemMessageDutch;
    }
    else if (language==='English'){
      languageArgumentTranscription='en';
    // system message for prompt message for English
      transcriptionPrompt='Transcribe every word and error exactly as they are spoken, without corrections or adjustments. Please capture every spoken detail faithfully. Example: I see cat.';
      systemMessage=systemMessageEnglish;
    }
    
    let chatHistory: any[] = [];
    chatHistory.push(systemMessage);
    // Transcribe the audio.
    const audioStream = fs.createReadStream(audio);
    const transcription = await openai.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: audioStream,
      language: languageArgumentTranscription,
      prompt: transcriptionPrompt
    });
  
    if (!transcription) {
      throw new Error('Transcription not found.');
    }
  
    console.log("transcription :", transcription.text);
  
    let voiceChatResponse;
    if (voiceChatId) {
      voiceChatResponse = await voiceChatDb.getVoiceChatById({ id: voiceChatId });

      if (!voiceChatResponse) {
        throw new Error('VoiceChat not found.');
      }
    }


    // Retrieve previous voice messages and push them into chatHistory.
    // only retrieve the last 3 -> to save tokens
    const voiceChatMessageHistory = await voiceChatDb.getVoiceMessagesByVoiceChatId(voiceChatId);
    voiceChatMessageHistory.forEach((message) => {
      chatHistory.push({ role: "user", content: message.prompt });
      chatHistory.push({
        role: "assistant", 
        content: message.getContent()
      });
    });
  
    // Append the new user transcription.
    chatHistory.push({ role: 'user', content: transcription.text });
  
    console.log("chatHistory");
    console.log(chatHistory.map((x) => JSON.stringify(x)));

    const chatHistoryFiltered = chatHistory.slice(0, 1).concat(chatHistory.slice(-6));

  
    // Get the API response.
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatHistoryFiltered,
    }); 
    //here add a chat that would just correct the previously transcribe and then pass it to the chat that would make a json
  
    if (!response) {
      throw new Error('Response not found.');
    }
  
  
    // Extract the JSON string from the response.
    const rawResponseContent = response.choices[0].message.content;
    if (!rawResponseContent) {
      throw new Error("No content received from API.");
    }
    console.log("raw response : "+rawResponseContent)
  
    // Parse the JSON string.
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawResponseContent);
    } catch (err) {
      throw new Error("Failed to parse JSON from API response: " + err);
    }


    console.log("response message", parsedResponse); 


    // First, extract the followupQuestion from the parsed response.
    const followupQuestion = parsedResponse.followupQuestion;

    // Create the VoiceMessage record for the assistant's response.
    const voiceMessagePrisma = await database.voiceMessage.create({
    data: {
        prompt: transcription.text,
        content: followupQuestion, // saving the follow-up question from the parsed response
        chat: voiceChatId ? { connect: { id: voiceChatId } } : undefined,
    },
    });

    // If a correction is provided in the parsed response, create a Correction record 
    // and connect it to the newly created VoiceMessage record.
    if (parsedResponse.correction) {
    const correction = await database.correction.create({
        data: {
        description: parsedResponse.correction.descriptionOfAllMistakes,
        isCorrectSentence: parsedResponse.correction.correctSentence,
        correctionOfEntireSentence: parsedResponse.correction.correctionOfEntireSentence,
        voiceMessage: { connect: { id: voiceMessagePrisma.id } },
        },
    });

    if (parsedResponse.correction.mistakesMade) {
        for (const mistake of parsedResponse.correction.mistakesMade) {
            await database.mistake.create({
                data: {
                problematicWord: mistake.problematicWord,
                explanation: mistake.explanation,
                correction: { connect: { id: correction.id } },
                brokeSubject: mistake.brokeSubject,
                },
            });
            }
        };
    }
    return parsedResponse;
  
}

// we can also add a language option for the very first question
const createFirstMessage = async ( voiceChatId: number, language: string): Promise<any> => {
  let firstSentence = "";
  if (language==="French"){
    firstSentence="De quoi voulez-vous parler ?"
  } 
  else if  (language==="English"){
    firstSentence= "What would you like to talk about?"
  }
  else if  (language==="Dutch"){
    firstSentence= "Waarover wilt u praten?"
  }
  await database.voiceMessage.create({
    data: {
        prompt: '',
        content: firstSentence, // saving the follow-up question from the parsed response
        chat: voiceChatId ? { connect: { id: voiceChatId } } : undefined,
    },
    });
}

const voiceMessageDb = {
    askVoiceMessage,
    createFirstMessage
};

export default voiceMessageDb;




// model User {
    //     id        Int         @id @default(autoincrement())
    //     username  String      @unique
    //     firstName String
    //     lastName  String
    //     email     String      @unique
    //     password  String
    //     chats     Chat[]      @relation("UserChats")
    //     VoiceChat VoiceChat[] @relation("UserVoiceChats")
    //     createdAt DateTime    @default(now())
    //   }
    
    //   model Chat {
        //     id        Int       @id @default(autoincrement())
        //     name      String    @default("Chat")
        //     user      User?     @relation("UserChats", fields: [userId], references: [id])
        //     userId    Int?
        //     messages  Message[] @relation("ChatMessages")
        //     createdAt DateTime  @default(now())
        //   }
        
        //   model Message {
            //     id        Int      @id @default(autoincrement())
            //     prompt    String
            //     content   String
            //     role      String
            //     chat      Chat?    @relation("ChatMessages", fields: [chatId], references: [id])
            //     chatId    Int?
            //     createdAt DateTime @default(now())
            //   }
            
//   model VoiceChat {
//     id        Int            @id @default(autoincrement())
//     name      String         @default("VoiceChat")
//     user      User?          @relation("UserVoiceChats", fields: [userId], references: [id])
//     userId    Int?
//     messages  VoiceMessage[] @relation("VoiceChatMessages")
//     createdAt DateTime       @default(now())
//   }

//   model VoiceMessage {
    //     id         Int          @id @default(autoincrement())
    //     prompt     String
    //     content    String
    //     role       String
    //     chat       VoiceChat?   @relation("VoiceChatMessages", fields: [chatId], references: [id])
    //     chatId     Int?
    //     correction Correction[] @relation("VoiceMessageCorrection")
    //     createdAt  DateTime     @default(now())
    //   }
    
    //   model Correction {
        //     id             Int          @id @default(autoincrement())
        //     description    String
        //     mistakes       Mistake[]    @relation("VoiceMessageCorrectionMistakes")
        //     voiceMessage   VoiceMessage @relation("VoiceMessageCorrection", fields: [voiceMessageId], references: [id])
        //     voiceMessageId Int
        //     createdAt      DateTime     @default(now())
        //   }
        
        // model Mistake {
        //     id              Int        @id @default(autoincrement())
        //     problematicWord String
        //     explanation     String
        //     correction      Correction @relation("VoiceMessageCorrectionMistakes", fields: [correctionId], references: [id])
        //     correctionId    Int
        //     brokeSubject    Boolean
        //     createdAt       DateTime   @default(now())
        //   }    
            
            
            //     response -->
            // {
            // id: 'chatcmpl-BG3CiIgowFv5R1L4bkQi0iiJ42vjr',
            // object: 'chat.completion',
            // created: 1743165264,
            // model: 'gpt-4o-mini-2024-07-18',
            // choices: [
            //     {
            //     index: 0,
            //     message: [Object],
            //     logprobs: null,
            //     finish_reason: 'stop'
            //     }
            // ],
            // usage: {
            //     prompt_tokens: 86,
            //     completion_tokens: 14,
            //     total_tokens: 100,
            //     prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
            //     completion_tokens_details: {
            //     reasoning_tokens: 0,
            //     audio_tokens: 0,
            //     accepted_prediction_tokens: 0,
            //     rejected_prediction_tokens: 0
            //     }
            // },
            // service_tier: 'default',
            // system_fingerprint: 'fp_b376dfbbd5'
            // }
