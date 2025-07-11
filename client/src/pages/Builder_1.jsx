import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import NavBar from '../components/NavBar';
import { generateCode } from '../api/llm';
import { useNavigate } from 'react-router-dom';
import { 
    Avatar, 
    AvatarIcon, 
    Card, 
    CardBody, 
    Tabs, 
    Tab,
    Button,
    Spinner,
    Chip,
    ScrollShadow,
    Divider
} from '@heroui/react';
import { WebContainer } from '@webcontainer/api';
import { Editor } from '@monaco-editor/react';

const Builder = () => {
    const nav = useNavigate();
    const { apiMessage, appProperties } = useAppContext();
    const [aiGeneratedCode, setAiGeneratedCode] = useState({});
    const [webcontainerInstance, setWebcontainerInstance] = useState(null);
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [files, setFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('code');
    const [consoleLogs, setConsoleLogs] = useState([]);
    const [installStatus, setInstallStatus] = useState('');
    const [serverStatus, setServerStatus] = useState('');
    const iframeRef = useRef(null);

    // Add console log
    const addConsoleLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setConsoleLogs(prev => [...prev, { message, type, timestamp }]);
    };

    const clearConsole = () => {
        setConsoleLogs([]);
    };

    const getCode = async () => {
        try {
            setIsLoading(true);
            addConsoleLog('Generating code with AI...', 'info');
            const { data } = await generateCode(appProperties);
            setAiGeneratedCode(data.data);
            addConsoleLog('Code generated successfully!', 'success');
        } catch (error) {
            console.error('Failed to generate code:', error);
            addConsoleLog(`Failed to generate code: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    // Initialize WebContainer
    useEffect(() => {
        const initWebContainer = async () => {
            try {
                addConsoleLog('Initializing WebContainer...', 'info');
                const webcontainer = await WebContainer.boot();
                setWebcontainerInstance(webcontainer);
                addConsoleLog('WebContainer initialized successfully', 'success');
            } catch (error) {
                console.error('Failed to initialize WebContainer:', error);
                addConsoleLog(`Failed to initialize WebContainer: ${error.message}`, 'error');
            }
        };

        initWebContainer();
    }, []);

    // Load files into WebContainer when AI code is generated
    useEffect(() => {
        if (aiGeneratedCode?.code?.files && webcontainerInstance) {
            mountFiles();
        }
    }, [aiGeneratedCode, webcontainerInstance]);

    // Convert AI generated code structure to WebContainer format
    const convertToWebContainerFiles = (aiFiles) => {
        const webContainerFiles = {};
        
        // Helper function to create nested directory structure
        const createNestedPath = (path, content) => {
            const parts = path.split('/').filter(part => part !== '');
            let current = webContainerFiles;
            
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!current[part]) {
                    current[part] = { directory: {} };
                }
                current = current[part].directory;
            }
            
            const filename = parts[parts.length - 1];
            current[filename] = {
                file: {
                    contents: content
                }
            };
        };

        aiFiles.forEach(file => {
            // Remove leading slash from file paths
            const normalizedPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
            
            if (file.type === 'file') {
                const content = file.content || file.defaultValue || '';
                
                // Handle nested paths
                if (normalizedPath.includes('/')) {
                    createNestedPath(normalizedPath, content);
                } else {
                    webContainerFiles[normalizedPath] = {
                        file: {
                            contents: content
                        }
                    };
                }
            }
        });

        return webContainerFiles;
    };

    const mountFiles = async () => {
        if (!webcontainerInstance || !aiGeneratedCode?.code?.files) return;

        setIsLoading(true);
        try {
            addConsoleLog('Mounting files to WebContainer...', 'info');
            const webContainerFiles = convertToWebContainerFiles(aiGeneratedCode.code.files);
            
            await webcontainerInstance.mount(webContainerFiles);
            addConsoleLog('Files mounted successfully', 'success');
            
            // Set up file list for editor
            const fileList = aiGeneratedCode.code.files
                .filter(file => file.type === 'file')
                .map(file => ({
                    name: file.path.startsWith('/') ? file.path.slice(1) : file.path,
                    path: file.path.startsWith('/') ? file.path.slice(1) : file.path,
                    content: file.content || file.defaultValue || ''
                }));
            
            setFiles(fileList);
            addConsoleLog(`${fileList.length} files loaded`, 'info');
            
            // Select first file by default (preferably src/App.tsx or similar)
            const defaultFile = fileList.find(f => f.path === 'src/App.tsx') || 
                              fileList.find(f => f.path === 'src/App.jsx') || 
                              fileList[0];
            
            if (defaultFile) {
                setSelectedFile(defaultFile.path);
                setFileContent(defaultFile.content);
                addConsoleLog(`Selected file: ${defaultFile.path}`, 'info');
            }

            // Install dependencies and start dev server
            await installDependencies();
            
        } catch (error) {
            console.error('Failed to mount files:', error);
            addConsoleLog(`Failed to mount files: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const installDependencies = async () => {
        if (!webcontainerInstance) return;

        try {
            addConsoleLog('Installing dependencies...', 'info');
            setInstallStatus('Installing dependencies...');
            
            // Install dependencies
            const installProcess = await webcontainerInstance.spawn('npm', ['install']);
            
            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                    addConsoleLog(`npm install: ${data}`, 'info');
                }
            }));

            const installExitCode = await installProcess.exit;
            
            if (installExitCode !== 0) {
                const errorMsg = `npm install failed with exit code: ${installExitCode}`;
                addConsoleLog(errorMsg, 'error');
                setInstallStatus('Installation failed');
                return;
            }

            addConsoleLog('Dependencies installed successfully', 'success');
            setInstallStatus('Dependencies installed');
            
            // Start dev server
            addConsoleLog('Starting dev server...', 'info');
            setServerStatus('Starting server...');
            
            const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
            
            devProcess.output.pipeTo(new WritableStream({
                write(data) {
                    addConsoleLog(`dev server: ${data}`, 'info');
                    // Look for local server URL in the output
                    if (data.includes('Local:')) {
                        const urlMatch = data.match(/Local:\s+(http[s]?:\/\/[^\s]+)/);
                        if (urlMatch) {
                            setUrl(urlMatch[1]);
                            addConsoleLog(`Server ready at: ${urlMatch[1]}`, 'success');
                            setServerStatus('Server running');
                        }
                    }
                }
            }));

            // Listen for server ready event
            webcontainerInstance.on('server-ready', (port, url) => {
                addConsoleLog(`Server ready at port ${port}: ${url}`, 'success');
                setUrl(url);
                setServerStatus('Server running');
            });

        } catch (error) {
            console.error('Failed to install dependencies or start server:', error);
            addConsoleLog(`Failed to install dependencies or start server: ${error.message}`, 'error');
            setInstallStatus('Installation failed');
            setServerStatus('Server failed');
        }
    };

    const handleFileSelect = (filePath) => {
        const file = files.find(f => f.path === filePath);
        if (file) {
            setSelectedFile(filePath);
            setFileContent(file.content);
            addConsoleLog(`File selected: ${filePath}`, 'info');
        }
    };

    const handleEditorChange = async (value) => {
        if (value === undefined) return;
        
        setFileContent(value);
        
        // Update file in WebContainer
        if (webcontainerInstance && selectedFile) {
            try {
                await webcontainerInstance.fs.writeFile(selectedFile, value);
                
                // Update local files state
                setFiles(prev => prev.map(file => 
                    file.path === selectedFile 
                        ? { ...file, content: value }
                        : file
                ));
                
                addConsoleLog(`File updated: ${selectedFile}`, 'info');
            } catch (error) {
                console.error('Failed to update file:', error);
                addConsoleLog(`Failed to update file: ${error.message}`, 'error');
            }
        }
    };

    const getFileName = (path) => {
        return path.split('/').pop();
    };

    const getFileExtension = (path) => {
        return path.split('.').pop();
    };

    const getEditorLanguage = (filePath) => {
        const ext = getFileExtension(filePath);
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown'
        };
        return languageMap[ext] || 'plaintext';
    };

    const getFileIcon = (filePath) => {
        const ext = getFileExtension(filePath);
        const iconMap = {
            'js': '🟨',
            'jsx': '⚛️',
            'ts': '🔷',
            'tsx': '⚛️',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'md': '📝'
        };
        return iconMap[ext] || '📄';
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return 'text-red-500';
            case 'success': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            default: return 'text-gray-400';
        }
    };

    // Sort files for better display
    const sortedFiles = files.sort((a, b) => {
        // Put important files first
        const importantFiles = ['package.json', 'index.html', 'src/main.tsx', 'src/App.tsx'];
        const aIndex = importantFiles.indexOf(a.path);
        const bIndex = importantFiles.indexOf(b.path);
        
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        return a.path.localeCompare(b.path);
    });

    useEffect(() => {
        if (apiMessage && apiMessage !== "" && appProperties && Object.keys(appProperties).length > 0) {
            getCode();
        } else {
            addConsoleLog("No data available, redirecting to home", 'warning');
            nav('/');
        }
    }, [apiMessage, appProperties, nav]);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <NavBar />
            <div className="pt-20">
                <div className='flex p-6 gap-6'>
                    {/* Sidebar */}
                    <div className='flex flex-col gap-4 w-80'>
                        <Card>
                            <CardBody>
                                <div className='flex gap-3'>
                                    <Avatar
                                        size='sm'
                                        classNames={{
                                            base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                                            icon: "text-black/80",
                                        }}
                                        icon={<AvatarIcon />}
                                    />
                                    <p className="text-sm">Make beautiful websites regardless of your design experience.</p>
                                </div>
                            </CardBody>
                        </Card>
                        
                        {/* Status Cards */}
                        <Card>
                            <CardBody className="py-3">
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium'>Files</span>
                                    <Chip size="sm" variant="flat" color="primary">
                                        {files.length}
                                    </Chip>
                                </div>
                                <div className='flex items-center justify-between mt-2'>
                                    <span className='text-sm font-medium'>WebContainer</span>
                                    <Chip 
                                        size="sm" 
                                        variant="flat" 
                                        color={webcontainerInstance ? 'success' : 'warning'}
                                    >
                                        {webcontainerInstance ? 'Ready' : 'Loading...'}
                                    </Chip>
                                </div>
                                {installStatus && (
                                    <div className='flex items-center justify-between mt-2'>
                                        <span className='text-sm font-medium'>Install</span>
                                        <Chip 
                                            size="sm" 
                                            variant="flat" 
                                            color={installStatus.includes('failed') ? 'danger' : 'success'}
                                        >
                                            {installStatus}
                                        </Chip>
                                    </div>
                                )}
                                {serverStatus && (
                                    <div className='flex items-center justify-between mt-2'>
                                        <span className='text-sm font-medium'>Server</span>
                                        <Chip 
                                            size="sm" 
                                            variant="flat" 
                                            color={serverStatus.includes('failed') ? 'danger' : 'success'}
                                        >
                                            {serverStatus}
                                        </Chip>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* File Explorer */}
                        <Card>
                            <CardBody className="p-0">
                                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                                    <h3 className='font-semibold text-sm'>Files Explorer</h3>
                                </div>
                                <ScrollShadow className="max-h-60">
                                    <div className='p-2'>
                                        {sortedFiles.map((file) => (
                                            <Button
                                                key={file.path}
                                                variant={selectedFile === file.path ? "flat" : "light"}
                                                color={selectedFile === file.path ? "primary" : "default"}
                                                className={`w-full justify-start mb-1 h-auto py-2 px-3`}
                                                onClick={() => handleFileSelect(file.path)}
                                            >
                                                <div className='flex items-center gap-2 w-full'>
                                                    <span className='text-sm'>
                                                        {getFileIcon(file.path)}
                                                    </span>
                                                    <div className='flex-1 text-left'>
                                                        <div className='text-sm font-medium truncate'>
                                                            {getFileName(file.path)}
                                                        </div>
                                                        <div className='text-xs text-gray-500 truncate'>
                                                            {file.path}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollShadow>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className='flex-1'>
                        <Card>
                            <CardBody className="p-0">
                                <Tabs
                                    selectedKey={activeTab}
                                    onSelectionChange={setActiveTab}
                                    aria-label="Builder tabs"
                                    classNames={{
                                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                        cursor: "w-full bg-primary",
                                        tab: "max-w-fit px-6 py-3 h-12",
                                        tabContent: "group-data-[selected=true]:text-primary"
                                    }}
                                >
                                    <Tab key="code" title="Code">
                                        <div className='h-[600px] flex flex-col'>
                                            {selectedFile && (
                                                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='text-sm'>{getFileIcon(selectedFile)}</span>
                                                        <span className='text-sm font-medium'>{selectedFile}</span>
                                                    </div>
                                                    <Chip size="sm" variant="flat">
                                                        {getFileExtension(selectedFile)}
                                                    </Chip>
                                                </div>
                                            )}
                                            <div className='flex-1'>
                                                {isLoading ? (
                                                    <div className='flex items-center justify-center h-full'>
                                                        <div className='text-center'>
                                                            <Spinner size="lg" />
                                                            <p className='text-sm text-gray-600 mt-4'>Setting up your project...</p>
                                                        </div>
                                                    </div>
                                                ) : selectedFile ? (
                                                    <Editor
                                                        height="100%"
                                                        language={getEditorLanguage(selectedFile)}
                                                        value={fileContent}
                                                        onChange={handleEditorChange}
                                                        theme="vs-dark"
                                                        options={{
                                                            minimap: { enabled: false },
                                                            fontSize: 14,
                                                            wordWrap: 'on',
                                                            automaticLayout: true,
                                                            scrollBeyondLastLine: false,
                                                            renderWhitespace: 'selection',
                                                            tabSize: 2,
                                                        }}
                                                    />
                                                ) : (
                                                    <div className='flex items-center justify-center h-full'>
                                                        <div className='text-center'>
                                                            <span className='text-4xl mb-4 block'>📁</span>
                                                            <p className='text-sm text-gray-600'>Select a file to start editing</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Tab>

                                    <Tab key="preview" title="Preview">
                                        <div className='h-[600px] flex flex-col'>
                                            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                                <h3 className='font-semibold text-sm'>Live Preview</h3>
                                                <div className='flex items-center gap-2'>
                                                    {url && (
                                                        <Button
                                                            size="sm"
                                                            variant="flat"
                                                            color="primary"
                                                            onClick={() => window.open(url, '_blank')}
                                                        >
                                                            Open in New Tab ↗
                                                        </Button>
                                                    )}
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat" 
                                                        color={url ? 'success' : 'warning'}
                                                    >
                                                        {url ? 'Ready' : 'Loading...'}
                                                    </Chip>
                                                </div>
                                            </div>
                                            <div className='flex-1 bg-white'>
                                                {isLoading ? (
                                                    <div className='flex items-center justify-center h-full'>
                                                        <div className='text-center'>
                                                            <Spinner size="lg" />
                                                            <p className='text-sm text-gray-600 mt-4'>Setting up your project...</p>
                                                        </div>
                                                    </div>
                                                ) : url ? (
                                                    <iframe
                                                        ref={iframeRef}
                                                        src={url}
                                                        className='w-full h-full border-0'
                                                        title='Live Preview'
                                                        onLoad={() => addConsoleLog('Preview loaded successfully', 'success')}
                                                    />
                                                ) : (
                                                    <div className='flex items-center justify-center h-full'>
                                                        <div className='text-center'>
                                                            <span className='text-4xl mb-4 block'>🔄</span>
                                                            <p className='text-sm text-gray-600'>Setting up preview...</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Tab>

                                    <Tab key="console" title="Console">
                                        <div className='h-[600px] flex flex-col'>
                                            <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                                <h3 className='font-semibold text-sm'>Console Logs</h3>
                                                <div className='flex items-center gap-2'>
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="danger"
                                                        onClick={clearConsole}
                                                    >
                                                        Clear Console
                                                    </Button>
                                                    <Chip size="sm" variant="flat">
                                                        {consoleLogs.length} logs
                                                    </Chip>
                                                </div>
                                            </div>
                                            <ScrollShadow className="flex-1 bg-black">
                                                <div className='p-4 font-mono text-sm'>
                                                    {consoleLogs.length === 0 ? (
                                                        <div className='text-gray-500 text-center py-8'>
                                                            No logs yet. Console output will appear here.
                                                        </div>
                                                    ) : (
                                                        consoleLogs.map((log, index) => (
                                                            <div key={index} className='mb-2'>
                                                                <span className='text-gray-500 text-xs'>
                                                                    [{log.timestamp}]
                                                                </span>
                                                                <span className={`ml-2 ${getLogColor(log.type)}`}>
                                                                    {log.message}
                                                                </span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </ScrollShadow>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Builder