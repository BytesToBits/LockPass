import _ from "lodash";

export default {
    dotWrap: (text: string, length?: number) => text.length <= (length || 30) ? text : _.trim(text.slice(0, (length || 30)+1).split(" ").slice(0, -1).join(' ') + '...'),
    deterPass: (strength) => {
        if (strength > 80) return { colorScheme: "green", value: strength }
        else if (strength > 60) return { colorScheme: "orange", value: strength }
        else return { colorScheme: "red", value: strength }
    }
}