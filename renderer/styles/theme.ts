import { extendTheme } from "@chakra-ui/react"
import { createBreakpoints } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
  xs: "25em",
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
})

const colors = {
    background: "#0e0e0e",
    tomato: "#fb6c6e"
}

const fonts = {
    body: "Poppins"
}

const styles = {
    global: (props) => ({
        "::-webkit-scrollbar": {
            width: "5px",
            height: "5px"
        },
        "::-webkit-scrollbar-thumb": {
            background: "gray",
            borderRadius: "30px"
        },
        "::-webkit-scrollbar-track": {
            background: "transparent"
        },
        body: {
            bg: "background",
            color: "white"
        },
    })
}

const theme = extendTheme({
    fonts,
    breakpoints,
    styles,
    colors
})

export default theme