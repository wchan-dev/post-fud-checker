import { Box } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";

import CommentSentimentForm from "./SentimentForm";
import CommentSentimentPlot from "./SentimentPlot";
import { getSentiment, SentimentResult } from "./getSentiment";

import { HistoryContext } from "../RedditQueryHistory/HistoryContext";

const SentimentPlotContainer: React.FC = () => {
  const [timeStamps, setTimeStamps] = useState<Date[]>([]);
  const [sentiments, setSentiments] = useState<number[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  const [historyList, setHistoryList] = useContext(HistoryContext);
  const [submissionDate, setSubmissionDate] = useState<Date>(new Date());
  const [subreddit, setSubreddit] = useState<string>("");

  useEffect(() => {
    const savedData = localStorage.getItem("plotData");
    if (savedData) {
      const { timeStamps, sentiments, postTitle } = JSON.parse(savedData);
      setTimeStamps(timeStamps.map((ts: string) => new Date(ts)));
      setSentiments(sentiments);
      setPostTitle(postTitle);
    }
  }, []);

  const handleGetSentiment = async (
    api_endpoint: string,
    reddit_url: string
  ) => {
    const {
      timeStamps,
      sentiments,
      postTitle,
      submission_Date,
      subreddit,
    }: SentimentResult = await getSentiment(api_endpoint, reddit_url);
    setTimeStamps(timeStamps);
    setSentiments(sentiments);
    setPostTitle(postTitle);
    setSubmissionDate(submission_Date);
    setSubreddit(subreddit);

    localStorage.setItem(
      "plotData",
      JSON.stringify({ timeStamps, sentiments, postTitle })
    );

    setHistoryList((prevHistory) => [
      ...prevHistory,
      {
        postTitle,
        postURL: reddit_url,
        numComments: sentiments.length, // Placeholder, replace with actual data
        overallSentiment:
          sentiments.reduce((a, b) => a + b, 0) / sentiments.length, // Placeholder, replace with actual data
        postDate: submission_Date,
        queryDate: new Date(), //this can be the current date
        subreddit: subreddit,
      },
    ]);
  };

  return (
    <Box display="flex" flexDirection="column" mb={8} p={8} gap={4}>
      <CommentSentimentPlot
        timeStamps={timeStamps}
        sentiments={sentiments}
        postTitle={postTitle}
      ></CommentSentimentPlot>
      <CommentSentimentForm
        handleGetSentiment={handleGetSentiment}
      ></CommentSentimentForm>
    </Box>
  );
};

export default SentimentPlotContainer;
