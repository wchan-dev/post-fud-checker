import { Flex, Stack, Text } from "@chakra-ui/react";
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
    sentiments_Avg: [] as number[],
    timeStamps_Avg: [] as Date[],
    bestComments: [] as Comment[],
    controversialComments: [] as Comment[],
  });

  const reconstructDateFromISOString = (isoStr: any) => {
    const dateParts = isoStr.match(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    return new Date(
      Date.UTC(
        dateParts[1],
        dateParts[2] - 1,
        dateParts[3],
        dateParts[4],
        dateParts[5],
        dateParts[6]
      )
    );
  };

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
        sentiments_Avg,
        timeStamps_Avg,
        bestComments,
        controversialComments,
      } = JSON.parse(savedData);

      setSentimentState({
        postTitle,
        subreddit,
        submissionDate: reconstructDateFromISOString(submissionDate),
        sentimentBaseline,
        sentiments_compound,
        timeStamps: timeStamps.map((ts: string) =>
          reconstructDateFromISOString(ts)
        ),
        sentiments_MovAvg,
        timeStamps_MovAvg: timeStamps_MovAvg.map((ts: string) =>
          reconstructDateFromISOString(ts)
        ),
        sentiments_Avg,
        timeStamps_Avg: timeStamps_Avg.map((ts: string) =>
          reconstructDateFromISOString(ts)
        ),
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
      sentiments_Avg,
      timeStamps_Avg,
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
      sentiments_Avg,
      timeStamps_Avg,
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
  const formattedTitle = `${sentimentState.subreddit}: ${sentimentState.postTitle}`;

  return (
    <Stack>
      <Header></Header>
      <Flex display="column" width="80%" mt={8} ml="auto" mr="auto" p={2}>
        <HistoryContext.Provider value={[historyList, setHistoryList]}>
          <ThemeToggler></ThemeToggler>
          <Text ml={2}>{formattedTitle}</Text>
          <SentimentForm
            handleGetSentiment={handleGetSentiment}
            handleClearHistory={handleClearHistory}
          />
          <SentimentHandler {...sentimentState} />
        </HistoryContext.Provider>
      </Flex>
    </Stack>
  );
};

export default PageLayOut;
