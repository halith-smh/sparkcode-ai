import { Accordion, AccordionItem, Snippet, Spinner } from '@heroui/react'
import { Check, Terminal } from 'lucide-react'
import React from 'react'

const Summary = ({ summary, isNpmInstall, isNpmRunDev }) => {
    console.log(isNpmInstall, isNpmRunDev);

    return (
        <div className='flex flex-col gap-4'>
            <p>{summary?.overview}</p>
            <p>{summary?.implementation}</p>
            <p>{summary?.designHighlights}</p>

            <div>
                <Accordion className='bg-[#221e1e]' variant="shadow" defaultExpandedKeys={["projectSetUp"]}>
                    <AccordionItem key="projectSetUp" aria-label="Accordion 1" title="Project Setup">
                        <div className='py-2'>
                            <div className="flex items-center">
                                {isNpmInstall !== null && isNpmInstall ? (
                                    <Check className='text-success mr-1' />
                                ) : (
                                    <Spinner className='mr-2' />
                                )}
                                <p className='py-2'>Install dependencies</p>
                            </div>
                            <Snippet size='sm' className='ml-6 mt-1'>npm install</Snippet>
                        </div>
                        {isNpmInstall && (
                            <div className="py-2">
                                <div className="flex items-center">
                                    {isNpmRunDev ? (
                                        <Check className='text-success mr-1' />
                                    ) : (
                                        <Spinner className='mr-1' />
                                    )}
                                    <p className='py-2'>Start application</p>
                                </div>
                                <Snippet size='sm' className='ml-6 mt-1'>npm run dev</Snippet>
                            </div>
                        )}
                    </AccordionItem>
                </Accordion>

            </div>
        </div>
    )
}

export default Summary