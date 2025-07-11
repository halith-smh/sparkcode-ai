import { Button, Chip, Textarea } from '@heroui/react'
import NavBar from '../components/NavBar'
import { UnicornBackground } from '../components/UnicornBackground'
import { ArrowRightIcon } from 'lucide-react'
import { spinnerProps } from '../utils/constants'
import { use, useState } from 'react'
import { generateTemplate } from '../api/llm'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const chipItems = ["React", "Next.js", "Tailwind CSS", "TypeScript"]

const Home = () => {
    const nav = useNavigate();

    const {userPrompt, setUserPrompt, setAppProperties, setApiMessage} = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [isInvalidInput, setIsInvalidInput] = useState(false);


    const handleInputChange = (e) => {
        setIsInvalidInput(false);
        setUserPrompt(e.target.value)
    }

    const handleTemplateSuccess = ({ data }) => {
        // console.log(data);
        if (data.isReactNext) {
            setAppProperties({
                query: userPrompt,
                fileStructure: {
                    projectName: data.projectName,
                    framework: data.framework,
                    language: data.language,
                    buildTool: data.buildTool,
                    structure: data.structure,
                }
            });
            setApiMessage(userPrompt);
            setIsLoading(false);
            setUserPrompt("");
            nav("/build");
        } else{
            setIsLoading(false);
            setIsInvalidInput(true);
            alert("Please enter a valid prompt to generate a React/Next.js app.");
            console.error("Invalid app type:", data.message);
        }
    }

    const handleGenerateApp = async () => {
        if (userPrompt.trim().length === 0) {
            setIsInvalidInput(true);
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await generateTemplate(userPrompt);
            handleTemplateSuccess(data);
        } catch (error) {
            console.error("Error generating app:", error);
            setIsLoading(false);
        }
    }
    return (
        <div className='min-h-screen'>
            <NavBar />
            <div className="h-screen w-screen flex items-center justify-center">
                <UnicornBackground />
                <div className="flex flex-col gap-6 items-center relative z-20 pt-4 pb-2 max-w-2xl mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
                            Build Apps with <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text">AI</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed py-4">
                            Transform your ideas into fully functional application with intelligent code generation
                        </p>
                    </div>

                    <div className="w-full max-w-md space-y-4">
                        <Textarea
                            disableAnimation
                            disableAutosize
                            classNames={{
                                base: "w-full",
                                input: "resize-y min-h-[120px] max-h-[300px] text-base text-[15px]",
                                inputWrapper: "bg-default-100/10 border-default-200/20 backdrop-blur-sm",
                                label: "text-default-400 text-lg font-semibold mb-2",
                            }}
                            label="Describe your app"
                            value={userPrompt}
                            isInvalid={isInvalidInput}
                            errorMessage="Please enter your prompt to continue"
                            onChange={(e) => handleInputChange(e)}
                            placeholder="E.g., Create a travel agency website with booking features"
                            variant="bordered"
                            size="lg"
                        />
                        <Button
                            isLoading={isLoading}
                            spinner={spinnerProps}
                            size="lg"
                            color="secondary"
                            className="w-full font-semibold"
                            endContent={<ArrowRightIcon className="w-4 h-4" />}
                            onPress={handleGenerateApp}
                        >
                            {`Generat${isLoading ? 'ing' : 'e'} App`}
                        </Button>
                    </div>


                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                        {chipItems.map((label, index) => (
                            <Chip
                                key={index}
                                className='bg-default-100/10 backdrop-blur-sm border border-default-200/30 text-default-400 px-3'
                                radius='lg'
                            >
                                {label}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home