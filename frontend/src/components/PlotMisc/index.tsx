import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Plot from "react-plotly.js";

interface CommentSentimentPlotProps {
  timeStamps: Date[];
  sentiments: number[];
}
const CommentSentimentPlot: React.FC<CommentSentimentPlotProps> = ({
  timeStamps,
  sentiments,
}) => {
  if (timeStamps.length === 0 || sentiments.length === 0) {
    return <p>No data to display</p>;
  }
  const data = [
    { x: timeStamps, y: sentiments, mode: "markers", type: "scatter" },
  ];
  const layout = {
    title: "Comment Sentiment Over Time",
    xaxis: { title: "Time", showgrid: true, zeroline: true },
    yaxis: { title: "Sentiment", showline: true },
  };
  return (
    <Box w="100%">
      <Plot data={data} layout={layout} />
    </Box>
  );
};

interface Comment {
  comment_timestamp: string;
  summation_score: number;
}

const CommentSentimentForm: React.FC = () => {
  const [postURL, setPostURL] = useState<string>("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [postTitle, setPostTitle] = useState();
  const url = `/api/sentiment/test`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setPostURL(postURL);
    setLoading(true);
    const data = { postURL };
    axios
      .post(url, data)
      .then((response) => {
        const timeStamps = response.data.comments.map(
          (comment: Comment) => new Date(comment.comment_timestamp)
        );
        const scores = response.data.comments.map(
          (comment: Comment) => comment.summation_score
        );
        setPostTitle(response.data.post);
        setTimeStamps(timeStamps);
        setSentiments(scores);
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <Box display="flex" alignItems="center" mr="auto" ml="auto">
      <Stack direction={"column"}>
        {" "}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Box>
            <Heading size="md">{postTitle}</Heading>
            <CommentSentimentPlot
              timeStamps={timeStamps}
              sentiments={sentiments}
            />
          </Box>
        )}
        <Center>
          <form onSubmit={handleSubmit}></form>
          <Input
            maxW="320px"
            type="text"
            value={postURL}
            onChange={(event) => setPostURL(event.target.value)}
          />
          <Button maxW="128px" ml="8px" onClick={handleClick}>
            Analyze
          </Button>
        </Center>
      </Stack>
    </Box>
  );
};

export default CommentSentimentForm;
