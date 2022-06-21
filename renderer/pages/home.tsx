import { Badge, Box, Button, Divider, Flex, Text } from "@chakra-ui/react"
import { ipcRenderer, shell } from "electron"
import { useEffect, useState } from "react"
import Main from "../components/Main"

const Commit = ({ data }) => {

    return (
        <Text _hover={{ textDecoration: "underline" }} cursor="pointer" onClick={() => shell.openExternal(data.html_url)}><code>{data.commit.message}</code> <Badge colorScheme="blue">{data.author.login}</Badge></Text>
    )
}

const Release = ({ data }) => {

    return (
        <Text _hover={{ textDecoration: "underline" }} cursor="pointer" onClick={() => shell.openExternal(data.html_url)}>
            <Badge colorScheme="green">{data.tag_name}</Badge> <code>{data.name}</code> <Badge colorScheme="blue">{data.author.login}</Badge>
            </Text>
    )
}

export default () => {
    const [firstFetch, setFetch] = useState(false)
    const [changelog, setChangelog] = useState([])
    const [releases, setReleases] = useState([])

    useEffect(() => {

        if (!firstFetch) {
            const init = async() => {
                if(navigator.onLine) {
                    const CH = await ipcRenderer.invoke("get-changelog")
                    const RL = await ipcRenderer.invoke("get-releases")
                    if (CH.message) {
                        setChangelog([])
                        console.log("Could not fetch changelog")
                    }
                    else {
                        setChangelog(CH)
                    }

                    if (RL.message) {
                        setReleases([])
                        console.log("Could not fetch changelog")
                    }
                    else {
                        setReleases(RL)
                    }
                } else {
                    setChangelog([])
                    setReleases([])
                }
            }
            init()

            setInterval(() => {
                init()
            }, 10000)

            setFetch(true)
        }
    })
    
    return (
        <Main>
            <Flex w="calc(100vw - 100px)" p={5} wrap="wrap" gap={5} maxH="calc(100vh - 30px)" overflowY="auto">
                <Box p={5} rounded="md" border="2px solid white" bg="darkBackground">
                    <Text fontWeight="bold">Recent Commits</Text>
                    <Divider />
                    {changelog.slice(0,9).map((data) => <Commit data={data} />)}
                </Box>

                <Box p={5} rounded="md" border="2px solid white" bg="darkBackground">
                    <Text fontWeight="bold">Releases</Text>
                    <Divider />
                    {releases.slice(0,9).map((data) => <Release data={data} />)}
                </Box>

            </Flex>
        </Main>
    )
}