import { File, GitFork, Folder } from 'lucide-react'
import { Accordion, AccordionItem, Listbox, ListboxItem, cn } from "@heroui/react";
import { label } from 'framer-motion/client';

const FileExplorer = ({ files, handleSelectedFile }) => {
    return (
        <div className='w-3/12 text-sm border-r border-[#342e2e]'>
            <h3 className='border-b pb-2 border-[#342e2e]'><GitFork className='inline w-5' /> Files</h3>
            <div className="h-[580px] overflow-y-auto scrollbar-hide">
                <FileTree handleSelectedFile={handleSelectedFile} files={files} />
            </div>
        </div>
    )
}

const FileTree = ({ files, handleSelectedFile }) => {
    return (
        <div className="w-full">
            {Object.entries(files).map(([key, value]) => (
                <FileTreeItem handleSelectedFile={handleSelectedFile} key={key} name={key} item={value} />
            ))}
        </div>
    );
};

const FileTreeItem = ({ name, item, handleSelectedFile }) => {
//    console.log(name, item);
   

    if (item.file) {
        return (
            <div onClick={() => handleSelectedFile(name, item)} key={name} className="flex items-center py-1 px-4 rounded hover:opacity-50 cursor-pointer">
                <File className='w-[14px] mr-2' />
                <span>{name}</span>
            </div>
        );
    }

    if (item.directory) {
        return (
            <div key={name} className="mb-1">
                <Accordion isCompact className='px-0'>
                    <AccordionItem
                        key={name}
                        aria-label={`Folder ${name}`}
                        title={name}
                        className=' cursor-pointer'
                        startContent={<Folder className='w-[14px]' />}
                    >
                        <div>
                            {Object.entries(item.directory).map(([childName, childItem]) => (
                                <FileTreeItem handleSelectedFile={handleSelectedFile} key={childName} name={childName} item={childItem} />
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