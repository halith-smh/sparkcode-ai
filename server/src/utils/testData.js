export const TEMPLATE_DATA = `
{
    "data": {
        "isReactNext": true,
        "message": "Creating a React app with TypeScript.",
        "projectName": "ChattyMate",
        "framework": "react",
        "language": "typescript",
        "buildTool": "vite",
        "structure": [
            {
                "name": "package.json",
                "type": "file",
                "path": "/",
                "defaultValue": "{\"name\":\"test-app\",\"private\":true,\"version\":\"0.0.0\",\"type\":\"module\",\"scripts\":{\"dev\":\"vite\",\"build\":\"vite build\",\"lint\":\"eslint .\",\"preview\":\"vite preview\"},\"dependencies\":{\"react\":\"^19.1.0\",\"react-dom\":\"^19.1.0\"},\"devDependencies\":{\"@eslint/js\":\"^9.29.0\",\"@types/react\":\"^19.1.8\",\"@types/react-dom\":\"^19.1.6\",\"@vitejs/plugin-react-swc\":\"^3.10.2\",\"eslint\":\"^9.29.0\",\"eslint-plugin-react-hooks\":\"^5.2.0\",\"eslint-plugin-react-refresh\":\"^0.4.20\",\"globals\":\"^16.2.0\",\"typescript\":\"~5.8.3\",\"typescript-eslint\":\"^8.34.1\",\"vite\":\"^7.0.0\",\"@tailwindcss/vite\": \"^4.1.11\",\"tailwindcss\": \"^4.1.11\"}}"
            },
            {
                "name": "vite.config.ts",
                "type": "file",
                "path": "/",
                "defaultValue": "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react-swc'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({plugins: [react(), tailwindcss()]})"
            },
            {
                "name": "tsconfig.node.json",
                "type": "file",
                "path": "/",
                "defaultValue": "{\"compilerOptions\":{\"tsBuildInfoFile\":\"./node_modules/.tmp/tsconfig.node.tsbuildinfo\",\"target\":\"ES2023\",\"lib\":[\"ES2023\"],\"module\":\"ESNext\",\"skipLibCheck\":true,\"moduleResolution\":\"bundler\",\"allowImportingTsExtensions\":true,\"verbatimModuleSyntax\":true,\"moduleDetection\":\"force\",\"noEmit\":true,\"strict\":true,\"noUnusedLocals\":true,\"noUnusedParameters\":true,\"erasableSyntaxOnly\":true,\"noFallthroughCasesInSwitch\":true,\"noUncheckedSideEffectImports\":true},\"include\":[\"vite.config.ts\"]}"
            },
            {
                "name": "tsconfig.json",
                "type": "file",
                "path": "/",
                "defaultValue": "{\"files\":[],\"references\":[{\"path\":\"./tsconfig.app.json\"},{\"path\":\"./tsconfig.node.json\"}]}"
            },
            {
                "name": "tsconfig.app.json",
                "type": "file",
                "path": "/",
                "defaultValue": "{\"compilerOptions\":{\"tsBuildInfoFile\":\"./node_modules/.tmp/tsconfig.app.tsbuildinfo\",\"target\":\"ES2022\",\"useDefineForClassFields\":true,\"lib\":[\"ES2022\",\"DOM\",\"DOM.Iterable\"],\"module\":\"ESNext\",\"skipLibCheck\":true,\"moduleResolution\":\"bundler\",\"allowImportingTsExtensions\":true,\"verbatimModuleSyntax\":true,\"moduleDetection\":\"force\",\"noEmit\":true,\"jsx\":\"react-jsx\",\"strict\":true,\"noUnusedLocals\":true,\"noUnusedParameters\":true,\"erasableSyntaxOnly\":true,\"noFallthroughCasesInSwitch\":true,\"noUncheckedSideEffectImports\":true},\"include\":[\"src\"]}"
            },
            {
                "name": "eslint.config.ts",
                "type": "file",
                "path": "/",
                "defaultValue": "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport tseslint from 'typescript-eslint'\nimport { globalIgnores } from 'eslint/config'\n\nexport default tseslint.config([globalIgnores(['dist']),{files:['**/*.{ts,tsx}'],extends:[js.configs.recommended,tseslint.configs.recommended,reactHooks.configs['recommended-latest'],reactRefresh.configs.vite],languageOptions:{ecmaVersion:2020,globals:globals.browser}}])"
            },
            {
                "name": ".gitignore",
                "type": "file",
                "path": "/",
                "defaultValue": "node_modules\ndist\n*.log\n.vscode/*\n!.vscode/extensions.json\n.DS_Store"
            },
            {
                "name": "index.html",
                "type": "file",
                "path": "/"
            },
            {
                "name": "README.MD",
                "type": "file",
                "path": "/"
            },
            {
                "name": "public",
                "type": "folder",
                "path": "/",
                "children": []
            },
            {
                "name": "src",
                "type": "folder",
                "path": "/",
                "children": [
                    {
                        "name": "assets",
                        "type": "folder",
                        "path": "/src/",
                        "children": []
                    },
                    {
                        "name": "main.tsx",
                        "type": "file",
                        "path": "/src/"
                    },
                    {
                        "name": "App.tsx",
                        "type": "file",
                        "path": "/src/"
                    },
                    {
                        "name": "index.css",
                        "type": "file",
                        "path": "/src/",
                        "defaultValue": "@import \"tailwindcss\";"
                    },
                    {
                        "name": "vite-env.d.ts",
                        "type": "file",
                        "path": "/src/",
                        "defaultValue": "/// <reference types=\"vite/client\" />"
                    },
                    {
                        "name": "components",
                        "type": "folder",
                        "path": "/src/",
                        "children": []
                    }
                ]
            }
        ]
    }
}
`

export const CHAT_DATA = `
{
    "data": {
        "properties": {
            "appName": "ChattyMate",
            "framework": "react",
            "language": "typescript",
            "libraries": [
                "react-router-dom",
                "lucide-react",
                "react",
                "react-dom"
            ],
            "buildTool": "vite"
        },
        "code": {
            "files": [
                {
                    "path": "/index.html",
                    "type": "file",
                    "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ChattyMate</title>\n  </head>\n  <body class=\"bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200\">\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n"
                },
                {
                    "path": "/README.md",
                    "type": "file",
                    "content": "# ChattyMate\n\nA simple ChatGPT-like website built with React and TypeScript.\n\n## Features\n\n-   Clean and responsive UI.\n-   Uses Tailwind CSS for styling.\n-   Implements a basic chat interface."
                },
                {
                    "path": "/package.json",
                    "type": "file",
                    "content": "{\"name\":\"test-app\",\"private\":true,\"version\":\"0.0.0\",\"type\":\"module\",\"scripts\":{\"dev\":\"vite\",\"build\":\"vite build\",\"lint\":\"eslint .\",\"preview\":\"vite preview\"},\"dependencies\":{\"lucide-react\": \"\",\"react\":\"^19.1.0\",\"react-dom\":\"^19.1.0\",\"react-router-dom\": \"\"},\"devDependencies\":{\"@eslint/js\":\"^9.29.0\",\"@types/react\":\"^19.1.8\",\"@types/react-dom\":\"^19.1.6\",\"@vitejs/plugin-react-swc\":\"^3.10.2\",\"eslint\":\"^9.29.0\",\"eslint-plugin-react-hooks\":\"^5.2.0\",\"eslint-plugin-react-refresh\":\"^0.4.20\",\"globals\":\"^16.2.0\",\"tailwindcss\": \"^4.1.11\",\"typescript\":\"~5.8.3\",\"typescript-eslint\":\"^8.34.1\",\"vite\":\"^7.0.0\",\"@tailwindcss/vite\": \"^4.1.11\"}}"
                },
                {
                    "path": "/vite.config.ts",
                    "type": "file",
                    "content": "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react-swc'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({plugins: [react(), tailwindcss()]})"
                },
                {
                    "path": "/.gitignore",
                    "type": "file",
                    "content": "node_modules\ndist\n*.log\n.vscode/*\n!.vscode/extensions.json\n.DS_Store"
                },
                {
                    "path": "/eslint.config.ts",
                    "type": "file",
                    "content": "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport tseslint from 'typescript-eslint'\nimport { globalIgnores } from 'eslint/config'\n\nexport default tseslint.config([globalIgnores(['dist']),{files:['**/*.{ts,tsx}'],extends:[js.configs.recommended,tseslint.configs.recommended,reactHooks.configs['recommended-latest'],reactRefresh.configs.vite],languageOptions:{ecmaVersion:2020,globals:globals.browser}}])"
                },
                {
                    "path": "/src/main.tsx",
                    "type": "file",
                    "content": "import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.tsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)\n"
                },
                {
                    "path": "/src/App.tsx",
                    "type": "file",
                    "content": "import React, { useState } from 'react';\nimport { LucideSendHorizonal } from 'lucide-react';\n\nfunction App() {\n  const [messages, setMessages] = useState<string[]>([]);\n  const [input, setInput] = useState<string>('');\n\n  const sendMessage = () => {\n    if (input.trim() !== '') {\n      setMessages([...messages, input]);\n      setInput('');\n    }\n  };\n\n  return (\n    <div className=\"flex flex-col h-screen\">\n      <header className=\"bg-blue-600 dark:bg-blue-800 text-white p-4\">\n        <h1 className=\"text-2xl font-semibold text-center\">ChattyMate</h1>\n      </header>\n\n      <main className=\"flex-1 p-4 overflow-y-auto\">\n        {messages.map((message, index) => (\n          <div key={index} className=\"mb-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700\">\n            {message}\n          </div>\n        ))}\n      </main>\n\n      <footer className=\"p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700\">\n        <div className=\"flex items-center\">\n          <input\n            type=\"text\"\n            className=\"flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n            placeholder=\"Type your message...\"\n            value={input}\n            onChange={(e) => setInput(e.target.value)}\n            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}\n          />\n          <button\n            className=\"ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200\"\n            onClick={sendMessage}\n          >\n            <LucideSendHorizonal size={20} />\n          </button>\n        </div>\n      </footer>\n    </div>\n  );\n}\n\nexport default App;\n"
                },
                {
                    "path": "/src/index.css",
                    "type": "file",
                    "defaultValue": "@import \"tailwindcss\";"
                },
                {
                    "path": "/src/vite-env.d.ts",
                    "type": "file",
                    "defaultValue": "/// <reference types=\"vite/client\" />"
                },
                {
                    "path": "/tsconfig.json",
                    "type": "file",
                    "defaultValue": "{\"files\":[],\"references\":[{\"path\":\"./tsconfig.app.json\"},{\"path\":\"./tsconfig.node.json\"}]}"
                },
                {
                    "path": "/tsconfig.app.json",
                    "type": "file",
                    "defaultValue": "{\"compilerOptions\":{\"tsBuildInfoFile\":\"./node_modules/.tmp/tsconfig.app.tsbuildinfo\",\"target\":\"ES2022\",\"useDefineForClassFields\":true,\"lib\":[\"ES2022\",\"DOM\",\"DOM.Iterable\"],\"module\":\"ESNext\",\"skipLibCheck\":true,\"moduleResolution\":\"bundler\",\"allowImportingTsExtensions\":true,\"verbatimModuleSyntax\":true,\"moduleDetection\":\"force\",\"noEmit\":true,\"jsx\":\"react-jsx\",\"strict\":true,\"noUnusedLocals\":true,\"noUnusedParameters\":true,\"erasableSyntaxOnly\":true,\"noFallthroughCasesInSwitch\":true,\"noUncheckedSideEffectImports\":true},\"include\":[\"src\"]}"
                },
                {
                    "path": "/tsconfig.node.json",
                    "type": "file",
                    "defaultValue": "{\"compilerOptions\":{\"tsBuildInfoFile\":\"./node_modules/.tmp/tsconfig.node.tsbuildinfo\",\"target\":\"ES2023\",\"lib\":[\"ES2023\"],\"module\":\"ESNext\",\"skipLibCheck\":true,\"moduleResolution\":\"bundler\",\"allowImportingTsExtensions\":true,\"verbatimModuleSyntax\":true,\"moduleDetection\":\"force\",\"noEmit\":true,\"strict\":true,\"noUnusedLocals\":true,\"noUnusedParameters\":true,\"erasableSyntaxOnly\":true,\"noFallthroughCasesInSwitch\":true,\"noUncheckedSideEffectImports\":true},\"include\":[\"vite.config.ts\"]}"
                }
            ]
        },
        "summary": {
            "overview": "ChattyMate is a simple ChatGPT-like web application built with React and TypeScript. It provides a basic chat interface where users can send and receive messages.",
            "implementation": "The application uses functional components and hooks for state management. Tailwind CSS is used for styling, providing a clean and responsive UI.  The main component manages the list of messages and user input.",
            "designHighlights": "The UI features a header, a message display area, and an input area for typing messages.  Dark and light mode color schemes provide a visually appealing experience, and the use of Lucide icons enhances the user interface."
        }
    }
}
`