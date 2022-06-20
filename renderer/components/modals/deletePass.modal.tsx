import { Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"

export default ({isOpen, onClose, password, callback}) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="menuBackground">
            <ModalHeader>
                Confirm Deletion
                <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
                {`Are you sure you want to delete ${password.label}? This action cannot be reversed.`}
            </ModalBody>
            <ModalFooter>
                <ButtonGroup>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button colorScheme="red" onClick={callback}>Delete</Button>
                </ButtonGroup>
            </ModalFooter>
        </ModalContent>
    </Modal>
)