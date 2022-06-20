import { Box, Button, ButtonGroup, CircularProgress, CircularProgressLabel, Flex, FormControl, FormLabel, HStack, Icon, Image, Input, Progress, Text, useClipboard, useDisclosure } from "@chakra-ui/react"
import { PasswordData } from "../util/interfaces"
import passwords from "../util/passwords"

import { RiKey2Fill } from "react-icons/ri"
import { AiFillEyeInvisible, AiFillEye, AiFillCopy } from "react-icons/ai"
import util from "../util/util"
import { useState } from "react"
import EditPassModal from "./modals/editPass.modal"

export default ({ uuid, data, setSelected }) => {
    const [reveal, setReveal] = useState(false)
    const editModal = useDisclosure()

    const password: PasswordData = data
    const extra = password.website || password.email || password.notes || `${data.label} Password`

    const { onCopy, hasCopied } = useClipboard(password.value)

    const deterPass = util.deterPass(passwords.strength(password.value))

    return (
        <>
            <EditPassModal onClose={editModal.onClose} isOpen={editModal.isOpen} uuid={uuid} data={data} />
            <HStack w="100%" p={5} gap={3}>
                {password.icon && (
                    <Image src={password.icon} draggable={false} boxSize="80px" rounded="md" />
                )}
                {!password.icon && (
                    <Icon fontSize="80px" as={RiKey2Fill} />
                )}

                <Box wordBreak={"break-all"}>
                    <Text fontWeight="bold" fontSize="25px">{util.dotWrap(password.label, 50)}</Text>
                    <Text>{util.dotWrap(extra, 50)}</Text>
                    <ButtonGroup>
                        <Button fontSize="12px" h="16px" colorScheme="orange" onClick={editModal.onOpen}>Edit</Button>
                        <Button fontSize="12px" h="16px" colorScheme="red" onClick={async() => {
                            setSelected(undefined)
                            await passwords.delete(uuid)
                        }}>Delete</Button>
                    </ButtonGroup>
                </Box>
            </HStack>

            <Flex w="calc(100% - 30px)" m={5} bg="background" border="1px solid white" rounded="md" p={3} justifyContent="start" alignItems="center">
                <Box>
                    <Box wordBreak={"break-all"}>
                        <Text fontWeight={"semibold"}>Username</Text>
                        <Text>{password.username || <em>No Username</em>}</Text>
                    </Box>

                    <Box wordBreak={"break-all"} my={2}>
                        <Text fontWeight={"semibold"}>Email</Text>
                        <Text>{password.email || <em>No Email</em>}</Text>
                    </Box>

                    <Box wordBreak={"break-all"}>
                        <HStack>
                            <Text fontWeight={"semibold"}>Password</Text>
                            <Icon as={reveal ? AiFillEye : AiFillEyeInvisible} onClick={() => setReveal(!reveal)} cursor="pointer" />
                            <Icon as={AiFillCopy} onClick={onCopy} color={hasCopied ? "limegreen" : "white"} transition=".3s linear" cursor="pointer" />
                        </HStack>
                        <Text>{reveal ? password.value : "•".repeat(password.value.length)}</Text>
                    </Box>
                </Box>

                <CircularProgress ml="auto" mt={2} value={deterPass.value} color={deterPass.colorScheme + ".400"}>
                    <CircularProgressLabel fontWeight={"bold"} fontSize="15px">{
                            deterPass.colorScheme == "green" ? "S" : (deterPass.colorScheme == "orange" ? "M" : "W") 
                        }</CircularProgressLabel>
                </CircularProgress>
            </Flex>

        </>
    )
}