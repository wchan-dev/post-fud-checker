import { Box, Heading } from "@chakra-ui/react";
import Plot from "react-plotly.js";

interface CommentSentimentPlotProps {
  timeStamps: Date[];
  sentiments: number[];
  postTitle: string;
}

const CommentSentimentPlot: React.FC<CommentSentimentPlotProps> = ({
  timeStamps,
  sentiments,
  postTitle,
}) => {
  // if (timeStamps.length === 0 || sentiments.length === 0) {
  //   return <p>No data to display</p>;
  // }
  const data = [
    { x: timeStamps, y: sentiments, mode: "markers", type: "scatter" },
  ];
  const layout = {
    title: "Comment Sentiment Over Time",
    xaxis: { title: "Time", showgrid: true, zeroline: true },
    yaxis: { title: "Sentiment", showline: true },
    margin: { 1: 25, r: 25, b: 25, t: 35 },
    width: "100%",
    autosize: true,
  };

  return (
    <Box display="flex" w="100%" border="1px">
      <Heading>{postTitle}</Heading>
      <Plot data={data} layout={layout} useResizeHandler={true} />
    </Box>
  );
};

export default CommentSentimentPlot;
