import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggler: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = colorMode === "light" ? MoonIcon : SunIcon;

  return (
    <Flex width="100%" justifyContent="flex-end">
      <IconButton
        width="1%"
        borderRadius="30px"
        mt={4}
        mb={-8}
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        aria-label="Toggle theme"
      />
    </Flex>
  );
};

export default ThemeToggler;
