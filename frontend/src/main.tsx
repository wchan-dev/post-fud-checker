import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { config, darkPastelTheme } from "./themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={darkPastelTheme}>
      <ColorModeScript initialColorMode={config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
