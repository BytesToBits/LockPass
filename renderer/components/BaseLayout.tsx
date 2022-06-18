import { Box, Container } from "@chakra-ui/react";
import Menu from "./Menu";

export default function BaseLayout({ children }) {
  return (
    <>
      <Menu />
      <Container maxW={"100vw"}  centerContent >
        <Box>
          <main>{children}</main>
        </Box>
      </Container>
    </>
  );
}
