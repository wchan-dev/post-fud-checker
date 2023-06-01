import { Flex } from "@chakra-ui/react";
import NavBar from "../Header";
import PlotContainer from "../PlotMisc";
import MainContent from "../MainContent";
// import { ReactNode } from "react";

// interface PageLayoutProps {
//   children: ReactNode;
// }
//
const PageLayOut = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar></NavBar>
      <MainContent></MainContent>
    </Flex>
  );
};

export default PageLayOut;
