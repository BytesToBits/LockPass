import { Flex, Icon, Image } from "@chakra-ui/react"
import { FaTimes, FaRegWindowMaximize, FaRegWindowMinimize } from "react-icons/fa"
import electron from "electron"

export default function Menu() {
    const MAX_HEIGHT = "30px"

    const MenuButton = ({ icon, eventName, ...props }) => {
        return (
            <Flex className="e-nodrag trans" alignItems="center" justifyContent={"center"} h={MAX_HEIGHT} _hover={{
                bg: "#3e3e3e"
            }} {...props}
                onClick={() => electron.ipcRenderer.send(eventName)}
            >
                <Icon as={icon} m={5} />
            </Flex>
        )
    }

    return (
        <>
            <Flex
                w="100%"
                position={"sticky"}
                top={0}
                h={MAX_HEIGHT}
                bg="#1e1e1e"
                mb={2}
                className={"e-drag"}
                justifyContent={"space-between"}
                alignItems={"center"}
                zIndex={9999}
            >
                <Image src="/images/icon.png" boxSize="20px" m={2} />

                <Flex direction="row" justifyContent="center" alignItems={"center"}>
                    <MenuButton icon={FaRegWindowMinimize} eventName="minimize-app" />
                    <MenuButton icon={FaRegWindowMaximize} eventName="maximize-app" />
                    <MenuButton icon={FaTimes} eventName="close-app" />
                </Flex>

            </Flex>
        </>
    )
} 