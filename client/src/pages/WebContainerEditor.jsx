import React, { useEffect, useState, useRef } from 'react';
import { Card, CardBody, Button, Tabs, Tab } from '@heroui/react';
import { Play, Download, RefreshCw } from 'lucide-react';

// Singleton WebContainer instance
let webcontainerInstance = null;

// WebContainer integration component
const WebContainerEditor = ({ aiGeneratedCode }) => {
  const [instance, setInstance] = useState(null);
  const [serverUrl, setServerUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState('');
  const [initError, setInitError] = useState(null);
  const editorRef = useRef(null);
  const iframeRef = useRef(null);

  // Initialize WebContainer (singleton pattern)
  useEffect(() => {
    const initWebContainer = async () => {
      try {
        setIsLoading(true);
        setInitError(null);
        
        // Check if WebContainer is supported
        if (!('SharedArrayBuffer' in window)) {
          throw new Error('WebContainer requires SharedArrayBuffer support. Please ensure COOP/COEP headers are set correctly.');
        }

        const { WebContainer } = await import('@webcontainer/api');
        
        // Use singleton pattern to avoid multiple instances
        if (!webcontainerInstance) {
          webcontainerInstance = await WebContainer.boot();
        }
        
        setInstance(webcontainerInstance);
        
        // Parse and mount AI generated code
        if (aiGeneratedCode) {
          await mountFiles(webcontainerInstance, aiGeneratedCode);
        }
      } catch (error) {
        console.error('Failed to initialize WebContainer:', error);
        setInitError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initWebContainer();
  }, []);

  // Parse AI generated code and create file structure
  const parseAiCode = (codeData) => {
    try {
      // If it's a JSON string, parse it
      if (typeof codeData === 'string') {
        codeData = JSON.parse(codeData);
      }
      
      // Extract files from the AI response structure
      const files = {};
      if (codeData.data && codeData.data.code && codeData.data.code.files) {
        codeData.data.code.files.forEach(file => {
          files[file.path] = {
            file: {
              contents: file.content || file.defaultValue || ''
            }
          };
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error parsing AI code:', error);
      return {};
    }
  };

  // Mount files to WebContainer
  const mountFiles = async (instance, codeData) => {
    try {
      const parsedFiles = parseAiCode(codeData);
      setFiles(parsedFiles);
      
      if (Object.keys(parsedFiles).length > 0) {
        await instance.mount(parsedFiles);
        
        // Set first file as current file
        const firstFile = Object.keys(parsedFiles)[0];
        setCurrentFile(firstFile);
        
        // Install dependencies if package.json exists
        if (parsedFiles['/package.json']) {
          await installDependencies(instance);
        }
      }
    } catch (error) {
      console.error('Error mounting files:', error);
    }
  };

  // Install dependencies
  const installDependencies = async (instance) => {
    setIsLoading(true);
    try {
      const installProcess = await instance.spawn('npm', ['install']);
      await installProcess.exit;
      console.log('Dependencies installed successfully');
    } catch (error) {
      console.error('Error installing dependencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start development server
  const startDevServer = async () => {
    if (!instance) return;
    
    setIsLoading(true);
    try {
      // Kill existing server if running
      try {
        await instance.spawn('pkill', ['-f', 'vite']);
      } catch (e) {
        // Ignore if no process to kill
      }

      const serverProcess = await instance.spawn('npm', ['run', 'dev'], {
        env: {
          ...process.env,
          PORT: '3000'
        }
      });
      
      instance.on('server-ready', (port, url) => {
        console.log('Server ready on:', url);
        setServerUrl(url);
        setIsLoading(false);
      });
      
      // Handle server output
      serverProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log('Server output:', data);
          }
        })
      );
    } catch (error) {
      console.error('Error starting dev server:', error);
      setIsLoading(false);
    }
  };

  // Simple code editor component
  const CodeEditor = ({ content, language = 'javascript' }) => {
    const [code, setCode] = useState(content || '');
    
    useEffect(() => {
      setCode(content || '');
    }, [content]);

    return (
      <div className="h-full">
        <textarea
          className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Your code here..."
          spellCheck={false}
        />
      </div>
    );
  };

  // File explorer component
  const FileExplorer = ({ files, currentFile, onFileSelect }) => {
    return (
      <div className="bg-gray-800 text-white p-2 h-full overflow-y-auto">
        <h3 className="font-semibold mb-2">Files</h3>
        {Object.keys(files).map((filePath) => (
          <div
            key={filePath}
            className={`cursor-pointer p-1 hover:bg-gray-700 rounded text-sm ${
              currentFile === filePath ? 'bg-blue-600' : ''
            }`}
            onClick={() => onFileSelect(filePath)}
          >
            {filePath.split('/').pop()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <Card className="h-full">
        <CardBody className="p-0 h-full">
          {initError ? (
            <div className="p-4 text-red-600 bg-red-50 rounded-lg">
              <h3 className="font-semibold">WebContainer Initialization Error</h3>
              <p className="text-sm mt-1">{initError}</p>
              <div className="mt-2 text-xs">
                <p>Make sure your site is served with these headers:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Cross-Origin-Embedder-Policy: require-corp</li>
                  <li>Cross-Origin-Opener-Policy: same-origin</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Code Editor</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => instance && mountFiles(instance, aiGeneratedCode)}
                    disabled={isLoading || !instance}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={startDevServer}
                    disabled={isLoading || !instance}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Run
                  </Button>
                </div>
              </div>

              <Tabs
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                className="flex-1"
              >
                <Tab key="code" title="Code">
                  <div className="flex h-96">
                    <div className="w-1/4 border-r">
                      <FileExplorer
                        files={files}
                        currentFile={currentFile}
                        onFileSelect={setCurrentFile}
                      />
                    </div>
                    <div className="flex-1">
                      <CodeEditor
                        content={files[currentFile]?.file?.contents || ''}
                        language="javascript"
                      />
                    </div>
                  </div>
                </Tab>
                
                <Tab key="preview" title="Preview">
                  <div className="h-96">
                    {serverUrl ? (
                      <iframe
                        ref={iframeRef}
                        src={serverUrl}
                        className="w-full h-full border-0"
                        title="App Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <p>No preview available</p>
                          <p className="text-sm">Click "Run" to start the development server</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default WebContainerEditor;