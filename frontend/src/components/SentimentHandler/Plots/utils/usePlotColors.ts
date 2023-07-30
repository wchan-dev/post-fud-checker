import { useColorMode, useTheme } from "@chakra-ui/react";

export const usePlotColors = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  // The 'color' property of the theme corresponds to the default text color
  const textColor =
    theme.colors[colorMode === "light" ? "black" : "whiteAlpha"][800];

  // The 'bg' property of the theme corresponds to the default background color
  const bgColor =
    colorMode === "light" ? theme.colors.white : theme.colors.gray[800];

  return { textColor, bgColor };
};
