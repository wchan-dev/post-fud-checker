import { Flex, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import NavBar from "../Navbar";
import SentimentPlotContainer from "../SentimentPlot";
import { QueryHistoryContainer } from "../RedditQueryHistory";
import { HistoryContext, History } from "../RedditQueryHistory/HistoryContext";
import Banner from "../Banner";

const PageLayOut: React.FC = () => {
  const [historyList, setHistoryList] = useState<History[]>(() => {
    const localData = localStorage.getItem("historyList");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  return (
    <Flex direction="column" minHeight="100vh">
      <Banner></Banner>
      <Flex direction="column" overflow="auto" p={8}>
        <HistoryContext.Provider value={[historyList, setHistoryList]}>
          <Box mb={-16}>
            {" "}
            {/* Apply marginBottom here */}
            <SentimentPlotContainer></SentimentPlotContainer>
          </Box>
          <QueryHistoryContainer></QueryHistoryContainer>
        </HistoryContext.Provider>
      </Flex>
    </Flex>
  );
};

export default PageLayOut;
