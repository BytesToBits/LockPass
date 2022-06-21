import { Badge, Checkbox, Divider, Flex, HStack, Text } from "@chakra-ui/react"
import { ipcRenderer } from "electron"
import { useEffect, useState } from "react"
import Main from "../components/Main"

export default () => {
    const [firstFetch, setFetch] = useState(false)

    const [beta, setBeta] = useState(false)
    const [version, setVersion] = useState("")
    
    useEffect(() => {

        if (!firstFetch) {
            const init = async() => {
                setBeta(await ipcRenderer.invoke("get-setting", "beta"))
                setVersion(await ipcRenderer.invoke("get-version"))
            }

            init()

            setFetch(true)
        }

    })

    const handleUpdate = async(name, value) => {
        await ipcRenderer.invoke("update-setting", name, value)
    }

    return (
        <Main>
            <Flex
                w="calc(100vw - 150px)"
                maxH="calc(100vh - 30px)"
                overflowY="auto"
                m={5}
                p={5}
                rounded="md"
                border="2px solid white"
                bg="darkBackground"
                direction="column"
            >
                <Text fontWeight="bold" fontSize="30px">Settings</Text>
                <Divider mb={2} />

                <HStack>
                    <Text>Beta Releases: </Text>
                    <Checkbox isChecked={beta} onChange={async() => {
                        await handleUpdate("beta", !beta)
                        setBeta(!beta)
                    }} />
                </HStack>

                <Badge colorScheme="orange" w="max-content" rounded="md" p={2} my={2}>Version: {version}</Badge>

            </Flex>
        </Main>
    )
}