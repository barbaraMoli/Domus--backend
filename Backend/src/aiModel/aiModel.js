import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const responseAI = async (req, res) => {
    const { prompt } = req.body;
    const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: prompt
    });

    res.json({ text: response.output[0].content[0].text });
};
