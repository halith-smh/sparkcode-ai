import axios from "./axios.js";

export const generateTemplate = (prompt) => axios.post('/llm/template', { query: prompt });

export const generateCode = (appProperties) => axios.post('/llm/chat', { query: appProperties.query, fileStructure: appProperties.fileStructure });

export const downloadCode = (files) => axios.post('/llm/download', { fileStructure: files}, {responseType: 'blob'});