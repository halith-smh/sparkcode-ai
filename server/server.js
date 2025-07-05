import express from 'express'
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai'


import { CHAT_SYSTEM_PROMPT, TEMPLATE_SYSTEM_PROMPT } from './utils/prompt.js';


import 'dotenv/config'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


app.post('/template', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { role: "system", content: TEMPLATE_SYSTEM_PROMPT },
            {
                role: "user",
                content: query.trim(),
            },
        ],
    });

    const rawResponse = response.choices[0].message.content;
    const jsonString = rawResponse.replace(/```json|```/g, '').trim();

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(jsonString)
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ error: 'Failed to parse response' });
    }

    res.json({
        data: parsedResponse,
    });
});

app.post('/chat', async (req, res) => {
    const { query, fileStructure } = req.body;

    if (!query || !fileStructure) {
        return res.status(400).json({ error: 'Query and file structure are required' });
    }

    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { role: "system", content: CHAT_SYSTEM_PROMPT(fileStructure) },
            {
                role: "user",
                content: query.trim(),
            },
        ],
    });

    console.log(response.choices[0].message.content);
    

    const rawResponse = response.choices[0].message.content;
    const jsonString = rawResponse.replace(/```json|```/g, '').trim();

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(jsonString)
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ error: 'Failed to parse response' });
    }

    res.json({
        data: parsedResponse,
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port:  http://localhost:${PORT}`);
});


// const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: '',
// });