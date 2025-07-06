import { Router } from "express";
import { generateChatResponse, generateTemplate } from "../controllers/llm.controller.js";

const llmRoutes = Router();

llmRoutes.post('/template', generateTemplate);
llmRoutes.post('/chat', generateChatResponse);

export default llmRoutes;
