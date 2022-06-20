import { Divider, Flex, Icon, Image, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { RiHome2Fill, RiKey2Fill, RiSettingsFill } from "react-icons/ri"

import _ from "lodash"

export default () => {
    const router = useRouter()

    const Page = ({ id, icon }) => {
        console.log(router.pathname)
        const isOnPage = _.trim(router.pathname, "/") == id

        return (
            <Icon
                as={icon}
                color={isOnPage ? "yellow.400" : "white"}
                background={isOnPage ? "whiteAlpha.200" : "transparent"}
                w="70px"
                p={2}
                rounded="md"
                fontSize="40px"
                cursor="pointer"
                transition={".1s linear"}
                _hover={isOnPage ? {} : {
                    bg: "whiteAlpha.300",
                }}
                onClick={() => router.push("/" + id)}
            />
        )
    }

    return (
        <Flex
            bg="darkBackground"
            w="100px"
            minH="calc(100vh - 30px)"
            color="white"
            alignItems="center"
            p={3}
            direction="column"
            gap={2}
        >
            <Flex gap={1} direction="column" alignItems="center">
                <Image src="/images/icon.ico" h="30px" draggable={false} />
                <Text fontWeight={"semibold"}>LockPass</Text>
            </Flex>

            <Divider />

            <Page id="home" icon={RiHome2Fill} />
            <Page id="settings" icon={RiSettingsFill} />
            <Page id="passwords" icon={RiKey2Fill} />
        </Flex>
    )
}