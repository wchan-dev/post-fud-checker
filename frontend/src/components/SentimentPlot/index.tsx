import { Box } from "@chakra-ui/react";
import { useState } from "react";
// import getSentiment from "./getSentiment";

import CommentSentimentForm from "./SentimentForm";
import CommentSentimentPlot from "./SentimentPlot";
import { getSentiment, SentimentResult } from "./getSentiment";

const SentimentPlotContainer: React.FC = () => {
  // const [postURL, setPostURL] = useState<string>("");
  const [timeStamps, setTimeStamps] = useState<Date[]>([]);
  const [sentiments, setSentiments] = useState<number[]>([]);
  const [postTitle, setPostTitle] = useState<string>("");
  // const [commentCountDiff, setCommentCountDiff] = useState();

  const handleGetSentiment = async (
    api_endpoint: string,
    reddit_url: string
  ) => {
    const { timeStamps, sentiments, postTitle }: SentimentResult =
      await getSentiment(api_endpoint, reddit_url);
    setTimeStamps(timeStamps);
    setSentiments(sentiments);
    setPostTitle(postTitle);
  };
  return (
    <Box display="flex" flexDirection="column" mb={8} p={8}>
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
