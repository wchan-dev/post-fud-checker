import { Stack, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { getSentiment, Comment, SentimentResult } from "../../api/getSentiment";

import SentimentForm from "../SentimentForm";
import SentimentHandler from "../SentimentHandler";
import { HistoryContext, History } from "../RedditQueryHistory/HistoryContext";
import Header from "../Header/index";
import ThemeToggler from "../ThemeToggler";

const PageLayOut: React.FC = () => {
  const [historyList, setHistoryList] = useState<History[]>([]);

  const [sentimentState, setSentimentState] = useState({
    postTitle: "" as string,
    subreddit: "" as string,
    submissionDate: new Date() as Date,
    sentimentBaseline: 0 as number,
    sentiments_compound: [] as number[],
    timeStamps: [] as Date[],
    sentiments_MovAvg: [] as number[],
    timeStamps_MovAvg: [] as Date[],
    bestComments: [] as Comment[],
    controversialComments: [] as Comment[],
  });

  useEffect(() => {
    const savedData = localStorage.getItem("plotData");
    if (savedData) {
      const {
        postTitle,
        subreddit,
        submissionDate,
        sentimentBaseline,
        sentiments_compound,
        timeStamps,
        sentiments_MovAvg,
        timeStamps_MovAvg,
        bestComments,
        controversialComments,
      } = JSON.parse(savedData);

      setSentimentState({
        postTitle,
        subreddit,
        submissionDate: new Date(submissionDate),
        sentimentBaseline,
        sentiments_compound,

        timeStamps: timeStamps.map((ts: string) => new Date(ts)),
        sentiments_MovAvg,
        timeStamps_MovAvg: timeStamps_MovAvg.map((ts: string) => new Date(ts)),
        bestComments,
        controversialComments,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("historyList", JSON.stringify(historyList));
  }, [historyList]);

  const handleGetSentiment = async (
    api_endpoint: string,
    reddit_url: string
  ) => {
    const {
      postTitle,
      subreddit,
      submissionDate,
      sentimentBaseline,
      sentiments_compound,
      timeStamps,
      sentiments_MovAvg,
      timeStamps_MovAvg,
      bestComments,
      controversialComments,
    }: SentimentResult = await getSentiment(api_endpoint, reddit_url);

    setSentimentState({
      postTitle,
      subreddit,
      submissionDate,
      sentimentBaseline,
      sentiments_compound,
      timeStamps,
      sentiments_MovAvg,
      timeStamps_MovAvg,
      bestComments,
      controversialComments,
    });

    localStorage.setItem(
      "plotData",
      JSON.stringify({
        ...sentimentState,
        submissionDate: submissionDate.toISOString(),
        timeStamps_MovAvg: timeStamps_MovAvg.map((date) => date.toISOString()),
      })
    );

    setHistoryList((prevHistory) => [
      ...prevHistory,
      {
        postTitle,
        postURL: reddit_url,
        numComments: sentiments_compound.length,
        overallSentiment:
          sentiments_compound.reduce((a, b) => a + b, 0) /
          sentiments_compound.length,
        postDate: submissionDate,
        queryDate: new Date(),
        subreddit: subreddit,
      },
    ]);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("historyList");
    setHistoryList([]);
  };

  return (
    <VStack>
      <Header></Header>
      <Stack p={2}>
        <HistoryContext.Provider value={[historyList, setHistoryList]}>
          <ThemeToggler></ThemeToggler>
          <SentimentForm
            handleGetSentiment={handleGetSentiment}
            handleClearHistory={handleClearHistory}
          />
          <SentimentHandler {...sentimentState} />
        </HistoryContext.Provider>
      </Stack>
    </VStack>
  );
};

export default PageLayOut;
