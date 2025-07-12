import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { X } from 'lucide-react'
import React from 'react'

const FullScreenModel = ({ isOpen, onClose, url }) => {
    
    return (
        <>
            <Modal closeButton={
                <Button startContent={<X/>} isIconOnly className='border' onPress={onClose}>
                    {/* Close Preview */}
                </Button>} 
                className='dark text-white' isOpen={isOpen} size="full" onClose={onClose}>
               
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="pt-8">
                                <iframe className='w-full h-12/12 rounded-xl' src={url} frameBorder="0"></iframe>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default FullScreenModel