import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
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
  const textColor = useColorModeValue("brand.text", "brand.textSecondary");
  const bgColor = useColorModeValue("brand.bg", "brand.bg");

  const data = [
    {
      x: timeStamps,
      y: sentiments,
      mode: "markers",
      marker: {
        color: textColor,
      },
    },
  ];

  const layout = {
    autosize: true,
    plot_bgcolor: bgColor,
    paper_bgcolor: bgColor,
    font: {
      family: "Inter, sans-serif",
      size: 12,
      color: textColor,
    },
    title: {
      text: "Comment Sentiment Over Time",
      font: {
        size: 14,
      },
    },
    xaxis: {
      title: "Time",
      showgrid: false,
      zeroline: true,
      tickformat: "%I:%M %p",
    },
    yaxis: {
      title: "Sentiment",
      showline: false,
    },
    margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 },
  };

  return (
    <Box w="100%" h="500px">
      <Stack>
        <Heading size="sm" textAlign="center">
          Post Title: {postTitle}
        </Heading>
        <Plot
          data={data}
          layout={layout}
          style={{ width: "100%", height: "100%" }}
          config={{ responsive: true }}
          revision={timeStamps.length}
        />
      </Stack>
    </Box>
  );
};

export default CommentSentimentPlot;
