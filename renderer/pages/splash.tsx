import { AbsoluteCenter, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import electron from "electron"

export default function SplashScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.getElementsByTagName("body")[0].className = "e-drag"

    setTimeout(() => {
      setLoading(false)
    }, 4500)
  })

  return (
    <AbsoluteCenter gap={2} w="max-content" userSelect="none">
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Image draggable={false} userSelect="none" src="/images/splash-icon.gif" boxSize="200px" />
        <Heading fontSize={20} userSelect="none"><em>LOADING PASSWORD MANAGER</em></Heading>

        <Button
          className="e-nodrag"
          isLoading={loading}
          cursor="pointer"
          variant="ghost"
          bg="green"
          mt={3}

          _hover={{
            bg: null
          }}
          _active={{
            bg: null
          }}

          onClick={() => electron.ipcRenderer.send('open-main')}
        >
            Open Manager
        </Button>
      </Flex>
    </AbsoluteCenter>
  );
};