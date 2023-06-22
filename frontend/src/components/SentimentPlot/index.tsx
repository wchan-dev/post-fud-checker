import { Box } from "@chakra-ui/react";
import { useEffect, useState, createContext, useContext } from "react";
// import getSentiment from "./getSentiment";

import CommentSentimentForm from "./SentimentForm";
import TestComponent from "./TestComponent";
import CommentSentimentPlot from "./SentimentPlot";

const SentimentPlotContainer: React.FC = () => {
  const [postURL, setPostURL] = useState<string>("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  // const [postTitle, setPostTitle] = useState();
  // const [commentCountDiff, setCommentCountDiff] = useState();
  //
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  // };

  // useEffect(() => {
  //   if (!sessionStorage.getItem("initialPostFetched")) {
  //     getInitial();
  //     sessionStorage.setItem("initialPostFetched", "true");
  //   }
  // }, []);
  //
  return (
    <Box display="flex" flexDirection="column" mb={8} p={8}>
      <CommentSentimentPlot
        timeStamps={timeStamps}
        sentiments={sentiments}
      ></CommentSentimentPlot>
      <CommentSentimentForm></CommentSentimentForm>
    </Box>
  );
};

export default SentimentPlotContainer;
