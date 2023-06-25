import { Flex, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NavBar from "../Header";
import SentimentPlotContainer from "../SentimentPlot";
import { QueryHistoryContainer } from "../RedditQueryHistory";
import { HistoryContext, History } from "../RedditQueryHistory/HistoryContext";

const PageLayOut: React.FC = () => {
  const [historyList, setHistoryList] = useState<History[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("historyList");
    if (data) {
      setHistoryList(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  return (
    <Flex direction="column" minHeight="100vh">
      <NavBar initialIsOpen={false}></NavBar>
      <HistoryContext.Provider value={[historyList, setHistoryList]}>
        <Stack>
          <SentimentPlotContainer></SentimentPlotContainer>
          <QueryHistoryContainer></QueryHistoryContainer>
        </Stack>
      </HistoryContext.Provider>
    </Flex>
  );
};

export default PageLayOut;
