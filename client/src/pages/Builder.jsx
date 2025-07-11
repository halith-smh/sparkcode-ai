import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import NavBar from '../components/NavBar';
import { generateCode } from '../api/llm';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarIcon, Card, CardBody, Image, Skeleton, Spinner, Tab, Tabs } from '@heroui/react';
import Summary from '../components/Summary';
import FileExplorer from '../components/FileExplorer';
import FileContent from '../components/FileContent';

const Builder = () => {
    const nav = useNavigate();
    const { apiMessage, appProperties } = useAppContext();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [Tabselected, setTabSelected] = useState("code");
    const [aiResponse, setAiResponse] = useState({});

    const getCode = async () => {
        try {
            const response = await generateCode(appProperties);
            if (response.status == 200) {
                setIsInitialLoading(false);
                const { data } = response;
                setAiResponse(data.data);
            }
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    useEffect(() => {
        if (apiMessage && apiMessage !== "" && appProperties && Object.keys(appProperties).length > 0) {
            getCode();
        } else {
            console.log('No Data Available: DEV PREVIEW');
            nav('/');
        }
    }, []);

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="pt-20">
                <div className="flex p-8 gap-8">
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
                            </div>) : <Summary summary={aiResponse.summary} />}

                        </Card>
                    </div>

                    <div className='w-8/12'>
                        <Card className='min-h-[720px]'>
                            <CardBody>
                                {isInitialLoading ?
                                    (<div className='w-full h-[670px] flex justify-center items-center'>
                                        <Spinner size='lg' classNames={{ label: "animate-pulse mt-4" }} label="Generating your application..." variant="wave" />
                                    </div>) :
                                    (<Tabs color='secondary' aria-label="Options" selectedKey={Tabselected} onSelectionChange={setTabSelected}>
                                        <Tab key="code" title="Code">
                                            <Card>
                                                <CardBody>
                                                    <div  className='flex gap-5'>
                                                        <FileExplorer files={aiResponse.code} />
                                                        <FileContent />
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Tab>
                                        <Tab key="preview" title="Preview">
                                            <Card>
                                                <CardBody>
                                                    <p>Comming soon...</p>
                                                </CardBody>
                                            </Card>
                                        </Tab>
                                    </Tabs>
                                    )}

                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;
