import { Flex } from "@chakra-ui/react";
import NavBar from "../Header";
// import { ReactNode } from "react";

// interface PageLayoutProps {
//   children: ReactNode;
// }
//
const PageLayOut = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar></NavBar>
    </Flex>
  );
};

export default PageLayOut;
