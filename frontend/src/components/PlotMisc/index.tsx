import { Box, Button, Input } from "@chakra-ui/react";
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
    { x: timeStamps, y: sentiments, mode: "lines+markers", type: "scatter" },
  ];
  const layout = {
    title: "Comment Sentiment Over Time",
    xaxis: { title: "Time", showgrid: true, zeroline: true },
    yaxis: { title: "Sentiment", showline: true },
  };
  return (
    <Box>
      <Plot data={data} layout={layout} />
    </Box>
  );
};

interface Comment {
  comment_timestamp: string;
  compound: number;
}

const CommentSentimentForm: React.FC = () => {
  const [postURL, setPostURL] = useState<string>("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [sentiments, setSentiments] = useState([]);
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
        const timeStamps = response.data.map(
          (comment: Comment) => new Date(comment.comment_timestamp)
        );
        const scores = response.data.map(
          (comment: Comment) => comment.compound
        );
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
      <form onSubmit={handleSubmit}></form>
      <Input
        type="text"
        value={postURL}
        onChange={(event) => setPostURL(event.target.value)}
      />
      <Button onClick={handleClick}>Analyze</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CommentSentimentPlot timeStamps={timeStamps} sentiments={sentiments} />
      )}
    </Box>
  );
};

export default CommentSentimentForm;
