import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";
import Logo from "./Logo";
import { ReactNode } from "react";

const NavBar = () => {
  return (
    <NavBarContainer>
      <Logo />
      <MenuLinks />
    </NavBarContainer>
  );
};

interface MenuItemProps {
  children: ReactNode;
  to?: string;
}
const MenuItem = ({ children, to = "/" }: MenuItemProps) => {
  return (
    <Link href={to}>
      <Text display="block" color="black">
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = () => {
  return (
    <Box flexBasis={{ base: "100%", md: "auto" }}>
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
      >
        <MenuItem>Home</MenuItem>
        <MenuItem>How It Works</MenuItem>
        <MenuItem>Post Analyzer</MenuItem>
      </Stack>
    </Box>
  );
};

interface NavBarContainerProps {
  children: React.ReactNode;
}
const NavBarContainer = ({ children }: NavBarContainerProps) => {
  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%">
      {children}
    </Flex>
  );
};

export default NavBar;
