import axios from "./axios";

export const generateTemplate = (prompt) => axios.post('/llm/template', { query: prompt });

export const generateCode = (appProperties) => axios.post('/llm/chat', { query: appProperties.query, fileStructure: appProperties.fileStructure });