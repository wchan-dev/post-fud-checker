import { Box } from "@chakra-ui/react";
import { useState, useContext } from "react";

import CommentSentimentForm from "./SentimentForm";
import CommentSentimentPlot from "./SentimentPlot";
import { getSentiment, SentimentResult } from "./getSentiment";

import { HistoryContext } from "../RedditQueryHistory/HistoryContext";

const SentimentPlotContainer: React.FC = () => {
  const [timeStamps, setTimeStamps] = useState<Date[]>([]);
  const [sentiments, setSentiments] = useState<number[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  const [historyList, setHistoryList] = useContext(HistoryContext);

  const handleGetSentiment = async (
    api_endpoint: string,
    reddit_url: string
  ) => {
    const { timeStamps, sentiments, postTitle }: SentimentResult =
      await getSentiment(api_endpoint, reddit_url);
    setTimeStamps(timeStamps);
    setSentiments(sentiments);
    setPostTitle(postTitle);

    setHistoryList((prevHistory) => [
      ...prevHistory,
      {
        postTitle,
        postURL: reddit_url,
        numComments: sentiments.length, // Placeholder, replace with actual data
        overallSentiment:
          sentiments.reduce((a, b) => a + b, 0) / sentiments.length, // Placeholder, replace with actual data
        postDate: new Date(), // Placeholder, replace with actual data
        queryDate: new Date(), //this can be the current date
      },
    ]);
  };

  return (
    <Box display="flex" flexDirection="column" mb={8} p={8} gap={4}>
      <CommentSentimentForm
        handleGetSentiment={handleGetSentiment}
      ></CommentSentimentForm>
      <CommentSentimentPlot
        timeStamps={timeStamps}
        sentiments={sentiments}
        postTitle={postTitle}
      ></CommentSentimentPlot>
    </Box>
  );
};

export default SentimentPlotContainer;
