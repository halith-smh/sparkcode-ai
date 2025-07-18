import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { downloadCode, generateCode } from '../api/llm';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarIcon, Button, Card, CardBody, Image, Skeleton, Spinner, Tab, Tabs, useDisclosure } from '@heroui/react';
import Summary from '../components/Summary';
import FileExplorer from '../components/FileExplorer';
import FileContent from '../components/FileContent';
import { getFileType } from '../utils/helper';
import { Download, File, Fullscreen } from 'lucide-react';
import { WebContainer } from '@webcontainer/api';
import FullScreenModel from '../components/FullScreenModel';
import toast from 'react-hot-toast';
import { toastError } from '../utils/constants';

const Builder = () => {
    const nav = useNavigate();
    const iframeRef = useRef(null);

    let webcontainerInstance = null;

    const { apiMessage, appProperties } = useAppContext();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [Tabselected, setTabSelected] = useState("code");
    const [aiResponse, setAiResponse] = useState({});

    const [displayEditorFile, setDisplayEditorFile] = useState({ value: 'Select any file to view the code...', type: "plaintext" });
    const [selectedFileName, setSelectedFileName] = useState("Files");

    const [IframeUrl, setIframeUrl] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isNpmInstall, setIsNpmInstall] = useState(null);
    const [isNpmRunDev, setIsNpmRunDev] = useState(null);

    const startDevServer = async (webcontainerInstance) => {
        setIsNpmInstall(false);
        const installProcess = await webcontainerInstance.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
            toast.error(error.message, toastError);
            console.error("npm install failed...");
        }
        setIsNpmInstall(true);

        setIsNpmRunDev(false);
        await webcontainerInstance.spawn('npm', ['run', 'dev']);


        webcontainerInstance.on('server-ready', (port, url) => {
            toast.success('Preview is ready to view', toastError);
            console.log('✅ WebContainer server is ready at:', url);
            setIframeUrl(url);
            setIsNpmRunDev(true);
            console.info('Iframe src added, now you can preview it');
        });

    };

    const getCode = async () => {
        try {
            const response = await generateCode(appProperties);
            if (response.status === 200) {
                setIsInitialLoading(false);
                const { data } = response;
                setAiResponse(data.data);

                try {
                    if (!webcontainerInstance) {
                        try {
                            webcontainerInstance = await WebContainer.boot();
                            console.log("✅ WebContainer booted");
                        } catch (error) {
                            console.error("Booting WebContainer failed:", error.message);
                            toast.error(error.message, toastError);
                            return;
                        }
                    } else {
                        console.log("Using existing WebContainer instance");
                    }

                    try {
                        await webcontainerInstance.mount(data.data.code);
                        console.log("✅ Project Files Mounted on WebContainer");

                        await startDevServer(webcontainerInstance);
                    } catch (error) {
                        console.error("Project Files Import on WebContainer: " + error.message);
                        toast.error(error.message, toastError);
                    }
                } catch (error) {
                    toast.error(error.message, toastError);
                    console.error("Initializing WebContainer: " + error.message);
                }
            }
        } catch (error) {
            toast.error(error.message, toastError);
            setIsInitialLoading(false);
            console.error("Error:", error.message);
        }
    };

    const handleSelectedFile = (name, { file }) => {
        // console.log(file.contents);
        // console.log(name);
        // console.log(getFileType(name));
        const value = file.contents;
        const type = getFileType(name);
        setSelectedFileName(name);
        setDisplayEditorFile({ value, type });
    }

    const downloadFiles = async () => {
        try {
            if (Object.keys(aiResponse).length > 0) {
                const response = await downloadCode(aiResponse.code);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'project-files.zip');
                document.body.appendChild(link);
                link.click();
                // Cleanup
                link.remove();
                window.URL.revokeObjectURL(url);
            }else{
                toast.error('No files found.')
            }
        } catch (error) {
            console.error('Error downloading files:', error);
            toast.error('Failed to download files. Please try again.');
        }
    };

    useEffect(() => {
        if (apiMessage && apiMessage !== "" && appProperties && Object.keys(appProperties).length > 0) {
            if (Object.keys(aiResponse).length === 0) {
                getCode();
            }
        } else {
            console.log('No Data Available: DEV PREVIEW');
            nav('/');
        }
        return () => {
            webcontainerInstance = null;
        }
    }, []);

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="pt-20">
                <div className="flex px-8 pt-8 gap-8">
                    <div className="flex flex-col gap-4 w-4/12">
                        <Card>
                            <CardBody>
                                <div className="flex gap-3">
                                    <div>
                                        <Avatar
                                            size="sm"
                                            classNames={{
                                                base: 'bg-gradient-to-br from-[#FFB457] to-[#FF705B]',
                                                icon: 'text-black/80',
                                            }}
                                            icon={<AvatarIcon />}
                                        />
                                    </div>
                                    <p className='pr-2 flex-row'>{apiMessage}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="space-y-5 p-4 min-h-45" radius="lg">
                            {isInitialLoading ? (<div className="space-y-3">
                                <Skeleton className="w-4/5 rounded-lg">
                                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                                </Skeleton>
                                <Skeleton className="w-5/5 rounded-lg">
                                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                                </Skeleton>
                                <Skeleton className="w-2/5 rounded-lg">
                                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                                </Skeleton>
                            </div>) : <Summary isNpmInstall={isNpmInstall} isNpmRunDev={isNpmRunDev} summary={aiResponse.summary} />}
                        </Card>
                    </div>

                    <div className='w-8/12'>
                        <Card className='min-h-[730px]'>
                            <CardBody>
                                {isInitialLoading ?
                                    (<div className='w-full h-[670px] flex justify-center items-center'>
                                        <Spinner size='lg' classNames={{ label: "animate-pulse mt-4" }} label="Generating your application..." variant="wave" />
                                    </div>) :
                                    (
                                        <Tabs color='secondary' aria-label="Options" selectedKey={Tabselected} onSelectionChange={setTabSelected}>
                                            <Tab key="code" title="Code">
                                                <Card className='bg-[#1e1e1e]'>
                                                    <CardBody>
                                                        <div className='flex gap-5'>
                                                            <FileExplorer handleSelectedFile={handleSelectedFile} files={aiResponse.code} />
                                                            <div className='w-full h-[580px]'>
                                                                <div>
                                                                    <h3 className='border-b pb-2 text-sm border-[#342e2e]'><File className='inline w-3 mr-1' />{selectedFileName}</h3>
                                                                </div>
                                                                <FileContent displayEditorFile={displayEditorFile} />

                                                            </div>

                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                            <Tab key="preview" title="Preview">
                                                {IframeUrl ? (
                                                    <iframe src={IframeUrl} className="w-full h-[600px] rounded-lg overflow-auto" />
                                                ) : (
                                                    <div className="w-full h-[600px] flex justify-center items-center">
                                                        <Spinner size='lg' classNames={{ label: "animate-pulse mt-4 text-md" }} label='Installing dependencies and starting preview...' />
                                                    </div>
                                                )}
                                            </Tab>
                                        </Tabs>
                                    )
                                }
                                {IframeUrl !== "" &&
                                    (
                                        <>
                                            <Button onPress={() => onOpen()} className='absolute top-4 right-3.5' size='sm' aria-label="Like">
                                                <Fullscreen className='w-5' /> Full Screen
                                            </Button>
                                            <Button onPress={() => downloadFiles()} className='absolute top-4 right-35 bg-secondary' size='sm' aria-label="Like">
                                                <Download className='w-5' /> Download
                                            </Button>
                                        </>
                                    )
                                }
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
            <FullScreenModel url={IframeUrl} isOpen={isOpen} onClose={onClose} />
        </div>
    );
};

export default Builder;
