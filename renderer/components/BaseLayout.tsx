import { Box, Container } from "@chakra-ui/react";
import Menu from "./Menu";

export default function BaseLayout({ children }) {
  return (
    <>
      <Menu />
      <Container centerContent bg="darkBackground" minW="100vw" minH="calc(100vh - 30px)">
        <Box maxW="100%" maxH="calc(100vh - 30px)">
          <main>{children}</main>
        </Box>
      </Container>
    </>
  );
}
