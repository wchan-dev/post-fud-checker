import { ThemeConfig, extendTheme } from "@chakra-ui/react";

export const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const darkPastelTheme = extendTheme({
  config,
  colors: {
    brand: {
      bg: "rgb(230, 236, 240)", // light pastel blue
      text: "rgb(105, 105, 105)", // grey
      textSecondary: "rgb(169, 169, 169)", // dark gray
      link: "rgb(100, 149, 237)", // cornflower blue
      linkHover: "rgb(70, 130, 180)", // steel blue
    },
  },
});

export const colorMap = {
  light: {
    "brand.text": "rgb(31,41,55)",
    "brand.textSecondary": "rgb(107,114,128)",
    "brand.bg": "rgb(255,255,255)",
  },
  dark: {
    "brand.text": "rgb(255,255,255)",
    "brand.textSecondary": "rgb(156,163,175)",
    "brand.bg": "rgb(17,24,39)",
  },
};
