import { Flex, Box, Stack, VStack } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";

import { getSentiment, Comment, SentimentResult } from "../../api/getSentiment";

import SentimentForm from "../SentimentForm";
import SentimentHandler from "../SentimentHandler";
import QueryHistoryContainer from "../RedditQueryHistory";
import { HistoryContext, History } from "../RedditQueryHistory/HistoryContext";
import Header from "../Header/index";
import ThemeToggler from "../ThemeToggler";

const PageLayOut: React.FC = () => {
  const [historyList, setHistoryList] = useState<History[]>([]);
  const [timeStamps, setTimeStamps] = useState<Date[]>([]);
  const [sentiments, setSentiments] = useState<number[]>([]);
  const [histogramSentiments, setHistogramSentiments] = useState<number[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  const [sentimentBaseline, setSentimentBaseline] = useState<number>(0);
  const [submissionDate, setSubmissionDate] = useState<Date>(new Date());
  const [subreddit, setSubreddit] = useState<string>("");
  const [movingAverageSentiments, setMovingAverageSentiments] = useState<
    number[]
  >([]);
  const [movingAverageTimes, setMovingAverageTimes] = useState<Date[]>([]);
  const [bestComments, setBestComments] = useState<Comment[]>([]);
  const [controversialComments, setControversialComments] = useState<Comment[]>(
    []
  );

  useEffect(() => {
    const savedData = localStorage.getItem("plotData");
    if (savedData) {
      const {
        timeStamps,
        sentiments,
        histogram_sentiments,
        postTitle,
        submission_Date,
        sentimentBaseline,
        movingAverageSentiments,
        movingAverageTimes,
        bestComments,
        controversialComments,
      } = JSON.parse(savedData);
      setTimeStamps(timeStamps.map((ts: string) => new Date(ts)));
      setSentiments(sentiments);
      setHistogramSentiments(histogram_sentiments || []);
      setPostTitle(postTitle);
      setSubmissionDate(new Date(submission_Date));
      setSentimentBaseline(sentimentBaseline);
      setMovingAverageSentiments(movingAverageSentiments);
      setMovingAverageTimes(
        movingAverageTimes.map((ts: string) => new Date(ts))
      );
      setBestComments(bestComments);
      setControversialComments(controversialComments);
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
      timeStamps,
      postTitle,
      sentiments_compound,
      histogram_sentiments,
      submission_Date,
      subreddit,
      sentimentBaseline,
      moving_average_sentiments,
      moving_average_times,
      bestComments,
      controversialComments,
    }: SentimentResult = await getSentiment(api_endpoint, reddit_url);

    const submissionDate = new Date(submission_Date);
    setTimeStamps(timeStamps);
    setSentiments(sentiments_compound);
    setHistogramSentiments(histogram_sentiments);
    setPostTitle(postTitle);
    setSubmissionDate(submissionDate);
    setSubreddit(subreddit);
    setSentimentBaseline(sentimentBaseline);
    setMovingAverageSentiments(moving_average_sentiments);
    setMovingAverageTimes(moving_average_times);
    setBestComments(bestComments);
    setControversialComments(controversialComments);

    localStorage.setItem(
      "plotData",
      JSON.stringify({
        timeStamps,
        sentiments: sentiments_compound,
        histogram_sentiments,
        postTitle,
        submission_Date: submissionDate.toISOString(),
        sentimentBaseline,
        movingAverageSentiments: moving_average_sentiments,
        movingAverageTimes: moving_average_times.map((date) =>
          date.toISOString()
        ),
        bestComments: bestComments,
        controversialComments: controversialComments,
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
          <SentimentHandler
            timeStamps={timeStamps}
            sentiments={sentiments}
            histogramSentiments={histogramSentiments}
            postTitle={postTitle}
            sentimentBaseline={sentimentBaseline}
            submissionDate={submissionDate}
            subreddit={subreddit}
            movingAverageSentiments={movingAverageSentiments}
            movingAverageTimes={movingAverageTimes}
            bestComments={bestComments}
            controversialComments={controversialComments}
          />
        </HistoryContext.Provider>
      </Stack>
    </VStack>
  );
};

export default PageLayOut;
