import { File, GitFork, Folder } from 'lucide-react'
import { Accordion, AccordionItem, Listbox, ListboxItem, cn } from "@heroui/react";
import { label } from 'framer-motion/client';

const FileExplorer = ({ files }) => {
    return (
        <div className='w-3/12 text-sm'>
            <h3><GitFork className='inline w-5' /> Files</h3>
            <div className='py-2'>
                <FileTree files={files}/>
            </div>
        </div>
    )
}

const FileTree = ({files}) => {
    return (
        <div className="w-full">
            {Object.entries(files).map(([key, value]) => (
                <FileTreeItem key={key} name={key} item={value} />
            ))}
        </div>
    );
};

const FileTreeItem = ({ name, item }) => {
    if (item.file) {
        return (
            <div key={name} className="flex items-center py-1 px-4 rounded hover:opacity-50 cursor-pointer">
                <File className='w-4 mr-2' />
                <span>{name}</span>
            </div>
        );
    }

    if (item.directory) {
        return (
            <div key={name} className="mb-1">
                <Accordion isCompact>
                    <AccordionItem 
                        key={name} 
                        aria-label={`Folder ${name}`} 
                        title={name}
                        startContent={<Folder className='w-4' />}
                    >
                        <div>
                            {Object.entries(item.directory).map(([childName, childItem]) => (
                                <FileTreeItem key={childName} name={childName} item={childItem} />
                            ))}
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }

    return null;
};

export default FileExplorer