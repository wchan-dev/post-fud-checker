import { Box, Button, Flex, Link, Stack, Text } from "@chakra-ui/react";
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
      {" "}
      <Text display="block" color="black">
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = () => {
  return (
    <Box>
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
      >
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/how">How It Works</MenuItem>
        <MenuItem to="post-analyzer">Post Analyzer</MenuItem>
        <MenuItem>
          <Button
            size="sm"
            rounded="md"
            color={["primary.500", "primary.500", "white", "white"]}
            bg={["white", "white", "primary.500", "primary.500"]}
            _hover={{
              bg: ["primary.100", "primary.100", "primary.600", "primary.600"],
            }}
          >
            Create Account
          </Button>
        </MenuItem>
      </Stack>
    </Box>
  );
};

interface NavBarContainerProps {
  children: React.ReactNode;
}
const NavBarContainer = ({ children }: NavBarContainerProps) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["white", "white", "primary.700", "primary.700"]}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
