import JSZip from "jszip";
import { MODEL, openai } from "../utils/constants.js";
import { parseJson } from "../utils/helper.js";
import { CHAT_SYSTEM_PROMPT, TEMPLATE_SYSTEM_PROMPT } from "../utils/prompt.js";

const generateTemplate = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: TEMPLATE_SYSTEM_PROMPT },
                {
                    role: "user",
                    content: query.trim(),
                },
            ],
            response_format: { type: "json_object" },
        });

        const rawResponse = response.choices[0].message.content;
        res.json({
            data: parseJson(rawResponse),
        });
    } catch (error) {
        console.error('Error generating template:', error);
        return res.status(500).json({ error: 'Failed to generate template' });
    }
}

const generateChatResponse = async (req, res) => {
    const { query, fileStructure } = req.body;

    if (!query || !fileStructure) {
        return res.status(400).json({ error: 'Prompt and file structure are required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system", content: CHAT_SYSTEM_PROMPT(fileStructure) },
                {
                    role: "user",
                    content: query.trim(),
                },
            ],
            response_format: { type: "json_object" },
        });
        const rawResponse = response.choices[0].message.content;
        res.json({
            data: parseJson(rawResponse),
        });
    } catch (error) {
        console.error('Error generating chat response:', error);
        return res.status(500).json({ error: 'Failed to generate chat response' });
    }
}

const downloadFiles = async (req, res) => {
    try {
        const { fileStructure } = req.body;
        if (!fileStructure) {
            return res.status(400).json({ error: 'File structure is required' });
        }

        const zip = new JSZip();
        const processStructure = (structure, currentPath = '') => {
            for (const [name, content] of Object.entries(structure)) {
                const fullPath = currentPath ? `${currentPath}/${name}` : name;
                
                if (content.file) {
                    zip.file(fullPath, content.file.contents);
                } else if (content.directory) {
                    zip.folder(fullPath);
                    processStructure(content.directory, fullPath);
                }
            }
        };
        
        processStructure(fileStructure);
        const zipBuffer = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="project-files.zip"');
        res.setHeader('Content-Length', zipBuffer.length);

        res.send(zipBuffer);
    } catch (error) {
        console.error('Error creating zip file:', error);
        res.status(500).json({ error: 'Failed to create zip file' });
    }
};

export { generateTemplate, generateChatResponse, downloadFiles };

