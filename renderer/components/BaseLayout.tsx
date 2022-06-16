import { Box, Flex } from "@chakra-ui/react";
import Menu from "./Menu";

export default function BaseLayout({ children }) {

    return (
        <>
            <Menu />

            <Box>
                <main>{children}</main>
            </Box>
        </>
    )
}