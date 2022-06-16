import { Button, Checkbox, Divider, Flex, FormControl, FormLabel, Input, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import BaseLayout from "../components/BaseLayout"
import electron from "electron"
import _ from "lodash"

export const PasswordView = ({ name, value, setPassList }) => {
    const [show, setShow] = useState(false)

    const handleDelete = async() => {
        electron.ipcRenderer.send('delete-pass', name)
        const passwords = await electron.ipcRenderer.invoke('pass-request')
        setPassList(passwords)
    }

    return (
        <Tr>
            <Td>{name}</Td>
            <Td>{show ? value : <em>Hidden</em>}</Td>
            <Td>
                <Button mr={2} colorScheme="orange" onClick={() => setShow(!show)}>Toggle Show</Button>
                <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
            </Td>
        </Tr>
    )
}

export default () => {
    const [passName, setPassName] = useState(undefined)
    const [passValue, setPassValue] = useState(undefined)
    const [passList, setPassList] = useState({})
    const [showPass, setShowPass] = useState(false)
    const [outdated, setOutdated] = useState(false)
    const [version, setVersion] = useState("")

    const [firstFetch, setFirstFetch] = useState(false)

    useEffect(() => {
        const setPasswords = async() => {
            const passwords = await electron.ipcRenderer.invoke('pass-request')
            setPassList(passwords)
            console.log(passwords)
            setFirstFetch(true)
        }

        if (!firstFetch) {
            setPasswords()
            electron.ipcRenderer.on('update-version', (event, ver) => {
                setVersion(ver)
                if (outdated) setVersion(`${ver} (outdated)`)
            })

            electron.ipcRenderer.on('new-update', (event, ver) => {
                setOutdated(true)
            })
        }
        
    })

    const handleAdd = async() => {
        electron.ipcRenderer.send('new-password', {name:passName, value:passValue})

        const passwords = await electron.ipcRenderer.invoke('pass-request')
        setPassList(passwords)
    }

    const handleGen = () => {
        const CHARS = "1234567890-=_+asdfghjkl;zxcvbnm,.!@#$%^&*()ASDFGHJKLZXCVBNM<>?"
        let password = ""
        for(let i = 0; i < _.range(12,25)[Math.floor(Math.random()*12)]; i++) {
            password += CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        setPassValue(password)
    }

    return (
        <BaseLayout>
            <Flex
                direction="column"
                m={5}
                justifyContent="center"
                alignItems="center"
            >   
                <FormControl>
                    <FormLabel>New password information:</FormLabel>
                    <Input value={passName} bottom={2} type="text" placeholder="Name" onChange={(e) => setPassName(e.target.value)} />
                    <Input value={passValue} type={showPass ? "text" : "password"} placeholder="*********" onChange={(e) => setPassValue(e.target.value)} />
                    <Checkbox mt={2} defaultChecked={showPass} onChange={() => setShowPass(!showPass)}>Show Password?</Checkbox>
                </FormControl>
                <Divider my={2} />
                <Flex gap={2} alignSelf="start">
                    <Button colorScheme="green" variant="outline" onClick={handleAdd}>Create new password</Button>
                    <Button colorScheme="orange" variant="outline" onClick={handleGen}>Generate new password</Button>
                </Flex>
                <Divider my={2} />
                <TableContainer maxW="max-content">
                    <Table variant="striped" colorScheme="red">
                        <TableCaption>* Password deletions are irreversible!</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Value</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.keys(passList).map((name, i) => <PasswordView name={name} value={passList[name]} setPassList={setPassList} />)}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>

            <Text fontSize="12px" opacity={.5} position="absolute" bottom="5px" right="5px" userSelect="none">
                Version: {version}
            </Text>
        </BaseLayout>
    )
}