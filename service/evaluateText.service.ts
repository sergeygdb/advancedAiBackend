import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



const evaluateText = async (text: string) => {
    try {

        if (!text) {
            throw new Error("text not provided");
        }

        const developerMessage = "You are an AI model that evaluates the language proficiency of a given text according to the CEFR (Common European Framework of Reference for Languages).\n\nPlease assess the level of the text and respond with one of the following options: A1, A2, B1, B2, C1, or C2. These are the only valid responses."



        const response = await openai.chat.completions.create({
            model: "ft:gpt-4.1-mini-2025-04-14:personal:cefr-predictor-mini:BPuZ38KG",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": developerMessage
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": text
                        }
                    ]
                }
            ],
            response_format: {
                "type": "text"
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: false
        });

       const cefrLevel = response.choices[0].message.content;

        return cefrLevel
    } catch (error) {
        console.error(error);
        throw new Error("text not provided");
    }
};

const chatService = {
    evaluateText
};

export default chatService;