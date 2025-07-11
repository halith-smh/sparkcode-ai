import axios from "./axios";

export const generateTemplate = (prompt) => axios.post('/llm/template/test', { query: prompt });

export const generateCode = (appProperties) => axios.post('/llm/chat/test', { query: appProperties.query, fileStructure: appProperties.fileStructure });