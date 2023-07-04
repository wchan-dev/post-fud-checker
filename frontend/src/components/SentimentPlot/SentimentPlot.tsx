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
  const bg = useColorModeValue("white", "gray.800");
  const text = useColorModeValue("black", "white");

  const data = [
    {
      x: timeStamps,
      y: sentiments,
      mode: "line",
      // marker: { color: "rgba(26,188,156,0.5)" },
    },
  ];

  const layout = {
    autosize: true,
    plot_bgcolor: bg,
    paper_bgcolor: bg,
    font: {
      family: "Inter, sans-serif",
      color: text,
      size: 12,
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
        />
      </Stack>
    </Box>
  );
};

export default CommentSentimentPlot;
