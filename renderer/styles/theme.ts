import { extendTheme } from "@chakra-ui/react"
import { createBreakpoints } from "@chakra-ui/theme-tools"
import Form from "../components/extentions/Form"

const breakpoints = createBreakpoints({
  xs: "25em",
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
})

const components = {
    Form
}

const colors = {
    background: "#636363",
    darkBackground: "#0e0e0e",
    menuBackground: "#1e1e1e",
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
    colors,
    components
})

export default theme