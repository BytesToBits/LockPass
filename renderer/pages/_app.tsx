import type { AppProps } from 'next/app'
import { ChakraProvider, Image } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'
import theme from '../styles/theme'
import Router from "next/router"
import Head from "next/head"
import { useState } from 'react'

import "../styles/main.css"
import ColorModeManager from '../components/ColorModeManager'

function MyApp({ Component, pageProps }: AppProps) {

  const [isLoading, setLoading] = useState(false)

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
  })

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false)
  })

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeManager/>
      {isLoading && (
          <Image alt="loading" src="/loading.svg" boxSize="50px" position="fixed" bottom="5px" right="5px" draggable="false" />
      )}
      <Flex flexDirection="column" minH="100vh">
          <Component {...pageProps} />
      </Flex>
    </ChakraProvider>
  )
}

export default MyApp