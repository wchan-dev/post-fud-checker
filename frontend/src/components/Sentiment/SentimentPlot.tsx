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
  subreddit: string;
  submissionDate: Date;
  sentimentBaseline: number;
  movingAverageSentiments: number[];
  movingAverageTimes: Date[];
}

const CommentSentimentPlot: React.FC<CommentSentimentPlotProps> = ({
  timeStamps,
  sentiments,
  histogram_sentiments,
  postTitle,
  subreddit,
  submissionDate,
  sentimentBaseline,
  movingAverageSentiments,
  movingAverageTimes,
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
    const baselineSentiment = {
      x: [submissionDate],
      y: [sentimentBaseline],
      mode: "markers",
      marker: { color: "#0077B6", size: 12 },
      name: "Baseline",
    };

    for (let i = 1; i < movingAverageTimes.length; i++) {
      if (movingAverageSentiments[i] >= movingAverageSentiments[i - 1]) {
        increasingSentiments.push({
          x: [movingAverageTimes[i]],
          y: [movingAverageSentiments[i]],
          mode: "markers",
          marker: { color: "green", size: 8 },
          name: "Increasing",
        });
      } else {
        decreasingSentiments.push({
          x: [movingAverageTimes[i]],
          y: [movingAverageSentiments[i]],
          mode: "markers",
          marker: { color: "red", size: 8 },
          name: "Decreasing",
        });
      }
    }
    data = [
      baselineSentiment,
      ...increasingSentiments,
      ...decreasingSentiments,
    ];
  } else if (plotType === "line") {
    const sentimentX = [];
    const sentimentY = [];
    const turningPointsX = [];
    const turningPointsY = [];

    const baselineSentiment = {
      x: [submissionDate],
      y: [sentimentBaseline],
      mode: "markers",
      marker: { color: "#0077B6", size: 12 }, // Deep Blue
      name: "Sentiment at Post",
    };

    const baselineSentimentLine = {
      x: [submissionDate, movingAverageTimes[0]],
      y: [sentimentBaseline, movingAverageSentiments[0]],
      mode: "lines",
      line: { shape: "linear", color: "#90E0EF", dash: "dash" }, // Light Cyan
      name: "Post-Comment Gap",
    };

    for (let i = 0; i < movingAverageTimes.length; i++) {
      sentimentX.push(movingAverageTimes[i]);
      sentimentY.push(movingAverageSentiments[i]);

      // Check if sentiment changes direction
      if (
        (i > 0 &&
          i < movingAverageTimes.length - 1 &&
          movingAverageSentiments[i - 1] < movingAverageSentiments[i] &&
          movingAverageSentiments[i] > movingAverageSentiments[i + 1]) ||
        (movingAverageSentiments[i - 1] > movingAverageSentiments[i] &&
          movingAverageSentiments[i] < movingAverageSentiments[i + 1])
      ) {
        turningPointsX.push(movingAverageTimes[i]);
        turningPointsY.push(movingAverageSentiments[i]);
      }
    }

    const sentimentLine = {
      x: sentimentX,
      y: sentimentY,
      mode: "lines",
      line: { shape: "spline", color: "26853f" }, // Green Sheen
      name: "Sentiment",
    };

    const turningPoints = {
      x: turningPointsX,
      y: turningPointsY,
      mode: "markers",
      marker: { color: "#d00000", size: 6 }, // Lusty Gallant (Deep Red)
      name: "Sentiment Shifts",
    };

    data = [
      baselineSentiment,
      baselineSentimentLine,
      sentimentLine,
      turningPoints,
    ];
  }
  const layout = {
    autosize: true,
    showlegend: true,
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
      title: plotType === "histogram" ? "Sentiment Score" : "Time (UTC)",
      showgrid: false,
      zeroline: true,
      autorange: true,
    },
    yaxis: {
      title: plotType === "histogram" ? "Comment Count" : "Sentiment",
      showline: false,
    },
    margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 },
  };

  const formatPlotTitle = (subreddit: string, postTitle: string) =>
    `r/${subreddit}: ${postTitle}`;

  const plotTitle = formatPlotTitle(subreddit, postTitle);

  return (
    <Box w="100%" height="500px" minW="864px" mb={16}>
      <Stack>
        <Heading mb={8} size="md" textAlign="center">
          {plotTitle}
        </Heading>
        <Select
          size="sm"
          width="fit-content"
          defaultValue="line"
          onChange={(event) =>
            setPlotType(event.target.value as "line" | "marker" | "histogram")
          }
        >
          <option value="line">Line plot</option>
          <option value="marker">Marker plot</option>
          <option value="histogram">Histogram</option>
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
