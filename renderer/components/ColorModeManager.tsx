import { useColorMode } from "@chakra-ui/react"
import { useEffect } from "react"

export default function ColorModeManager() {

    const { colorMode, setColorMode } = useColorMode()

    useEffect(() => {
        if (colorMode !== "dark") setColorMode("dark")
    }, [colorMode, setColorMode])

    return <></>
}