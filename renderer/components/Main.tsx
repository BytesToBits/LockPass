import { Flex } from "@chakra-ui/react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

export default ({ children }) => {
  return (
    <>
      <Menu />

      <Flex maxW="100vw" maxH="calc(100vh - 30px)">
        <Sidebar />

        <main>{children}</main>
      </Flex>
    </>
  );
}
