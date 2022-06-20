import { Flex, FormControl, FormLabel, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Text } from "@chakra-ui/react"
import { ipcRenderer, nativeImage } from "electron"
import { useState } from "react"
import passwords from "../../util/passwords"

import { AiFillEyeInvisible, AiFillEye, AiOutlinePlus } from "react-icons/ai"
import { ImFolderUpload } from "react-icons/im"
import { IoDice } from "react-icons/io5";

const deterPass = (strength) => {
    if (strength > 80) return { colorScheme: "green", value: strength }
    else if (strength > 60) return { colorScheme: "orange", value: strength }
    else return { colorScheme: "red", value: strength }
}

export default ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const [label, setLabel] = useState("")
    const [value, setValue] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [website, setWebsite] = useState("")
    const [notes, setNotes] = useState("")
    const [icon, setIcon] = useState(undefined)


    const handleSelect = async () => {
        console.log("Select Handler...")

        const fp = await ipcRenderer.invoke("select-file")

        if (fp) {
            const image = nativeImage.createFromPath(fp[0])
            setIcon(image.toDataURL())
        } else {
            setIcon(undefined)
        }
    }

    const handleAdd = async () => {
        setLoading(true)

        await passwords.save({ label, value, username, email, website, notes, icon })

        setLoading(false)

        onClose()

        setLabel("")
        setValue("")
        setEmail("")
        setWebsite("")
        setNotes("")
        setUsername("")
        setIcon(undefined)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="menuBackground">
                <ModalHeader>
                    New Password
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
                            <Progress rounded="md" mt={2} h="5px" {...deterPass(passwords.strength(value))} isAnimated hasStripe />
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
                    <IconButton icon={<AiOutlinePlus />} colorScheme="green" aria-label="add-pass-button" isLoading={loading} onClick={handleAdd} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}