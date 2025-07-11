import { Router } from "express";
import { generateChatResponse, generateTemplate } from "../controllers/llm.controller.js";
import fs from 'fs/promises';
import path from 'path';

const llmRoutes = Router();

llmRoutes.post('/template', generateTemplate);
llmRoutes.post('/chat', generateChatResponse);

// TEST Routes
llmRoutes.post('/template/test', async (req, res) => {

    const filePath = path.join(process.cwd(), 'src', 'utils', 'template.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    setTimeout(() => {
        res.status(200).json(jsonData)
    }, 1000);
});
llmRoutes.post('/chat/test', async (req, res) => {
    const { query, fileStructure } = req.body;
    if (!query || !fileStructure) {
        return res.status(400).json({ error: 'Prompt and file structure are required' });
    }

    const filePath = path.join(process.cwd(), 'src', 'utils', 'chat.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    setTimeout(() => {
        res.status(200).json(jsonData)
    }, 1000);
});

export default llmRoutes;
