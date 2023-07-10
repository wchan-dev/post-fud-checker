import {
  Box,
  Heading,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import Plot from "react-plotly.js";

interface CommentSentimentPlotProps {
  timeStamps: Date[];
  sentiments: number[];
  histogram_sentiments: number[];
  postTitle: string;
}

const CommentSentimentPlot: React.FC<CommentSentimentPlotProps> = ({
  timeStamps,
  sentiments,
  histogram_sentiments,
  postTitle,
}) => {
  const [plotType, setPlotType] = useState<"line" | "histogram" | "marker">(
    "line"
  );

  const textColor = useColorModeValue("brand.text", "brand.textSecondary");
  const bgColor = useColorModeValue("brand.bg", "brand.bg");

  let data;

  if (plotType === "histogram") {
    const positiveSentiments = histogram_sentiments.filter(
      (sentiment) => sentiment >= 0
    );
    const negativeSentiments = histogram_sentiments.filter(
      (sentiment) => sentiment < 0
    );

    data = [
      {
        x: positiveSentiments,
        type: "histogram",
        nbinsx: 50,
        autobinx: false,
        opacity: 0.7,
        marker: {
          color: "green",
        },
        name: "Positive Sentiment",
      },
      {
        x: negativeSentiments,
        type: "histogram",
        nbinsx: 50,
        autobinx: false,
        opacity: 0.7,
        marker: {
          color: "red",
        },
        name: "Negative Sentiment",
      },
    ];
  } else if (plotType === "marker") {
    const decreasingSentiments = [];
    const increasingSentiments = [];

    for (let i = 1; i < timeStamps.length; i++) {
      if (sentiments[i] >= sentiments[i - 1]) {
        increasingSentiments.push({
          x: [timeStamps[i]],
          y: [sentiments[i]],
          mode: "markers",
          marker: { color: "green", size: 7 },
          name: "Increasing",
        });
      } else {
        decreasingSentiments.push({
          x: [timeStamps[i]],
          y: [sentiments[i]],
          mode: "markers",
          marker: { color: "red", size: 7 },
          name: "Decreasing",
        });
      }
    }

    data = [...increasingSentiments, ...decreasingSentiments];
  } else {
    const decreasingSentiments = [];
    const increasingSentiments = [];

    for (let i = 1; i < timeStamps.length; i++) {
      if (sentiments[i] >= sentiments[i - 1]) {
        increasingSentiments.push({
          x: [timeStamps[i - 1], timeStamps[i]],
          y: [sentiments[i - 1], sentiments[i]],
          mode: "lines",
          line: { color: "green" },
          name: "Increasing",
        });
      } else {
        decreasingSentiments.push({
          x: [timeStamps[i - 1], timeStamps[i]],
          y: [sentiments[i - 1], sentiments[i]],
          mode: "lines",
          line: { color: "red" },
          name: "Decreasing",
        });
      }
    }

    data = [...increasingSentiments, ...decreasingSentiments];
  }

  // Add layout
  const layout = {
    autosize: true,
    showlegend: false,
    plot_bgcolor: bgColor,
    paper_bgcolor: bgColor,
    font: {
      family: "Inter, sans-serif",
      size: 12,
      color: textColor,
    },
    title: {
      text:
        plotType === "histogram"
          ? "Frequency Distribution of Comment Sentiment"
          : "Comment Sentiment Over Time",
      font: {
        size: 14,
      },
      x: 0.5,
    },
    xaxis: {
      title: plotType === "histogram" ? "Sentiment Score" : "Time",
      showgrid: false,
      zeroline: true,
    },
    yaxis: {
      title: plotType === "histogram" ? "Comment Count" : "Sentiment",
      showline: false,
    },
    margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 },
  };

  return (
    <Box w="100%" height="600px" minW="864px">
      <Stack>
        <Heading size="sm" textAlign="center">
          Post Title: {postTitle}
        </Heading>
        <Select
          size="sm"
          width="fit-content"
          onChange={(event) =>
            setPlotType(event.target.value as "line" | "histogram" | "marker")
          }
        >
          <option value="line">Line plot</option>
          <option value="histogram">Histogram</option>
          <option value="marker">Marker plot</option>
        </Select>
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
