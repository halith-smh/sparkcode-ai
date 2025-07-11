import { Accordion, AccordionItem, Snippet } from '@heroui/react'
import { Terminal } from 'lucide-react'
import React from 'react'

const Summary = ({ summary }) => {

    return (
        <div className='flex flex-col gap-4'>
            <p>{summary?.designHighlights}</p>
            <p>{summary?.implementation}</p>
            <p>{summary?.overview}</p>

            <div>
                <Accordion className='bg-[#221e1e]' variant="shadow">
                    <AccordionItem key="1" aria-label="Accordion 1" title="Project Setup">
                        <div className='py-2'>
                            <p className='py-2'>Install dependencies</p>
                            <Snippet size='sm' className='ml-1' >npm install</Snippet>
                        </div>
                        <div className="py-2">
                            <p className='py-2'>Start application</p>
                            <Snippet size='sm' className='ml-1'>npm run dev</Snippet>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default Summary