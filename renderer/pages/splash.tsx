import { AbsoluteCenter, Button, Flex, Heading, Image, Progress } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import electron, { ipcRenderer } from "electron"

export default function SplashScreen() {
  const [loading, setLoading] = useState(true)
  const [loadingText, setLoadingText] = useState("Loading...")
  const [downloadProgress, setDownloadProgress] = useState(null)
  const [firstFetch, FirstFetch] = useState(false)

  useEffect(() => {
    if (!firstFetch) {
      FirstFetch(true)
      document.getElementsByTagName("body")[0].className = "e-drag"

      setTimeout(() => {
        electron.ipcRenderer.on('load-window', () => setLoading(false))
        electron.ipcRenderer.on('update-progress', (event, progress) => {
          setLoadingText("Downloading update...")
          setDownloadProgress(progress)
        })
        electron.ipcRenderer.send('check-updates')
        setLoadingText("Checking for updates...")

        if (process.env.NODE_ENV == "development") setLoading(false)
      }, 4500)
    }
  })

  return (
    <AbsoluteCenter gap={2} w="max-content" userSelect="none">
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Image draggable={false} userSelect="none" src="/images/splash-icon.gif" boxSize="200px" />
        <Heading fontSize={20} userSelect="none"><em>LOADING PASSWORD MANAGER</em></Heading>

        <Button
          className="e-nodrag"
          isLoading={loading}
          loadingText={loadingText}
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

        {downloadProgress && (
          <Progress mt={5} w="50%" rounded="md" hasStripe value={downloadProgress} isAnimated colorScheme="green" />
        )}
      </Flex>
    </AbsoluteCenter>
  );
};