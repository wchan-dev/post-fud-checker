import { Box } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";

import CommentSentimentForm from "./SentimentForm";
import CommentSentimentPlot from "./SentimentPlot";
import { getSentiment, SentimentResult } from "./getSentiment";

import { HistoryContext } from "../RedditQueryHistory/HistoryContext";

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
        style={{ order: 1 }}
      ></CommentSentimentPlot>
      <CommentSentimentForm
        handleGetSentiment={handleGetSentiment}
        handleClearHistory={handleClearHistory}
        style={{ order: 2 }}
      ></CommentSentimentForm>
    </Box>
  );
};

export default SentimentPlotContainer;
