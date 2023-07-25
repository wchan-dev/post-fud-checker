import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";

import CommentSentimentForm from "./SentimentForm";
import CommentSentimentPlot from "./SentimentPlot";
import { getSentiment, SentimentResult } from "./getSentiment";

import { HistoryContext } from "../RedditQueryHistory/HistoryContext";
import { Comment } from "./getSentiment";
import CommentsTableContainer from "./CommentsTable";

const SentimentPlotContainer: React.FC = () => {
  const [timeStamps, setTimeStamps] = useState<Date[]>([]);
  const [sentiments, setSentiments] = useState<number[]>([]);
  const [histogramSentiments, setHistogramSentiments] = useState<number[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  const [sentimentBaseline, setSentimentBaseline] = useState<number>(0);
  const [historyList, setHistoryList] = useContext(HistoryContext);
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
    <Box display="flex" flexDirection="column" mb={8} p={8} gap={4}>
      <CommentSentimentForm
        handleGetSentiment={handleGetSentiment}
        handleClearHistory={handleClearHistory}
        style={{ order: 1 }}
      ></CommentSentimentForm>
      <CommentSentimentPlot
        timeStamps={timeStamps}
        sentiments={sentiments}
        histogram_sentiments={histogramSentiments}
        postTitle={postTitle}
        subreddit={subreddit}
        submissionDate={submissionDate}
        sentimentBaseline={sentimentBaseline}
        movingAverageSentiments={movingAverageSentiments}
        movingAverageTimes={movingAverageTimes}
        style={{ order: 2 }}
      ></CommentSentimentPlot>
      <Flex flexDirection="row" justifyContent="space-between" gap={4} mb={8}>
        <Stack>
          <Heading size="small">Top 5 Best Comments</Heading>
          <CommentsTableContainer
            comments={bestComments}
          ></CommentsTableContainer>
        </Stack>
        <Stack>
          <Heading size="small">Top 5 Most Controversial Comments</Heading>
          <CommentsTableContainer
            comments={controversialComments}
          ></CommentsTableContainer>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SentimentPlotContainer;
