import OpenAI from 'openai'
import { GEMINI_API_KEY } from '../config/env.js';

export const openai = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const MODEL = "gemini-2.0-flash";