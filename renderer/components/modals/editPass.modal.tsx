import { Flex, FormControl, FormLabel, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Text } from "@chakra-ui/react"
import { ipcRenderer, nativeImage } from "electron"
import { useState } from "react"
import passwords from "../../util/passwords"

import { AiFillEyeInvisible, AiFillEye, AiOutlinePlus, AiFillEdit } from "react-icons/ai"
import { ImFolderUpload } from "react-icons/im"
import { IoDice } from "react-icons/io5";
import util from "../../util/util"

export default ({ isOpen, onClose, uuid, data }) => {
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const [label, setLabel] = useState(data.label)
    const [value, setValue] = useState(data.value)
    const [username, setUsername] = useState(data.username)
    const [email, setEmail] = useState(data.email)
    const [website, setWebsite] = useState(data.website)
    const [notes, setNotes] = useState(data.notes)
    const [icon, setIcon] = useState(data.icon)


    const handleSelect = async () => {
        const fp = await ipcRenderer.invoke("select-file")

        if (fp) {
            const image = nativeImage.createFromPath(fp[0]).resize({
                height: 100,
                width: 100
            })
            setIcon(image.toDataURL())
        } else {
            setIcon(undefined)
        }
    }

    const handleEdit = async () => {
        setLoading(true)

        await passwords.edit(uuid, { label, value, username, email, website, notes, icon })

        setLoading(false)

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="menuBackground">
                <ModalHeader>
                    Edit Password
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Flex gap={4} direction="column" mb={5}>

                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground" isRequired>
                            <Input placeholder=" " type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
                            <FormLabel>Label</FormLabel>
                        </FormControl>

                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground" labelExtra={{ mx: "58px" }} isRequired>
                            <InputGroup>
                                <InputLeftAddon cursor="pointer" onClick={() => setValue(passwords.generate())}>
                                    <Icon as={IoDice} />
                                </InputLeftAddon>
                                <Input placeholder=" " type={showPass ? "text" : "password"} value={value} onChange={(e) => setValue(e.target.value)} />
                                <FormLabel>Password</FormLabel>
                                <InputRightAddon cursor="pointer" onClick={() => setShowPass(!showPass)}>
                                    <Icon as={showPass ? AiFillEye : AiFillEyeInvisible} />
                                </InputRightAddon>
                            </InputGroup>
                            <Progress rounded="md" mt={2} h="5px" {...util.deterPass(passwords.strength(value))} isAnimated hasStripe />
                        </FormControl>
                    </Flex>

                    <Flex gap={4} direction="column">
                        <Text fontSize="lg" fontWeight={"bold"}>Additional Information</Text>
                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground">
                            <Input placeholder=" " type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <FormLabel>Username</FormLabel>
                        </FormControl>

                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground">
                            <Input placeholder=" " type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <FormLabel>Email</FormLabel>
                        </FormControl>

                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground">
                            <Input placeholder=" " type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
                            <FormLabel>Website</FormLabel>
                        </FormControl>

                        {/* @ts-ignore */}
                        <FormControl variant="floating" labelColor="menuBackground">
                            <Input placeholder=" " type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            <FormLabel>Notes</FormLabel>
                        </FormControl>

                        {/* @ts-ignore */}
                        <HStack>
                            <Text>Upload Icon: </Text>
                            {!icon && (
                                <Icon as={ImFolderUpload} bg="whiteAlpha.100" p={3} fontSize="40px" color="white" rounded="md" cursor="pointer" onClick={handleSelect} />
                            )}
                            {icon && (
                                <Image src={icon} boxSize="40px" rounded="md" onClick={handleSelect} />
                            )}
                        </HStack>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <IconButton icon={<AiFillEdit />} colorScheme="green" aria-label="add-pass-button" isLoading={loading} onClick={handleEdit} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}