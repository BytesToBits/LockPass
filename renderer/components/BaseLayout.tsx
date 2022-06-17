import { Box, Container, Flex } from "@chakra-ui/react";
import Menu from "./Menu";

export default function BaseLayout({ children }) {
  return (
    <>
      <Menu />
      <Container maxW={"1300px"}  centerContent >
        <Box>
          <main>{children}</main>
        </Box>
      </Container>
    </>
  );
}
