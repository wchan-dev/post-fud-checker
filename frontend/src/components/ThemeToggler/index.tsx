import { Button, useColorMode } from "@chakra-ui/react";

const ThemeToggler: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button width="20%" mt={4} onClick={toggleColorMode}>
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  );
};

export default ThemeToggler;
