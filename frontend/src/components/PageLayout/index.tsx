import { Flex } from "@chakra-ui/react";
import NavBar from "../Header";
import SentimentPlotContainer from "../SentimentPlot";
// import MainContent from "../MainContent";
// import { ReactNode } from "react";

// interface PageLayoutProps {
//   children: ReactNode;
// }
//
const PageLayOut = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar initialIsOpen={false}></NavBar>
      <SentimentPlotContainer></SentimentPlotContainer>
    </Flex>
  );
};

export default PageLayOut;
