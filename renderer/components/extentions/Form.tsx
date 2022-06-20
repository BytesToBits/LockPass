const activeLabelStyles = {
    transform: "scale(0.85) translateY(-24px)"
  };

export default {
    variants: {
      floating: ({ labelColor, labelExtra }) => ({
        container: {
          _focusWithin: {
            label: {
              ...activeLabelStyles
            }
          },
          "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label": {
            ...activeLabelStyles
          },
          label: (props) => ({
            top: 0,
            left: 0,
            zIndex: 2,
            position: "absolute",
            backgroundColor: labelColor || "darkBackground",
            pointerEvents: "none",
            mx: 3,
            px: 1,
            my: 2,
            transformOrigin: "left top",
            ...labelExtra
          })
        }
      })
    }
  }