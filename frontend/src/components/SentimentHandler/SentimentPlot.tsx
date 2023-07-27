import { Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import Plot from "react-plotly.js";

export interface CommentSentimentPlotProps {
  timeStamps: Date[];
  sentiments: number[];
  histogram_sentiments: number[];
  postTitle: string;
  subreddit: string;
  submissionDate: Date;
  sentimentBaseline: number;
  movingAverageSentiments: number[];
  movingAverageTimes: Date[];
  plotType: string;
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
  plotType,
}) => {
  const textColor = useColorModeValue("brand.text", "brand.textSecondary");
  const bgColor = useColorModeValue("brand.bg", "brand.bg");

  let data;

  if (plotType === "histogram") {
    const sentimentRanges = [
      {
        min: -Infinity,
        max: -75,
        color: "DarkRed",
        label: "Extremely Negative",
      },
      { min: -75, max: -50, color: "Red", label: "Very Negative" },
      { min: -50, max: -25, color: "IndianRed", label: "Negative" },
      { min: -25, max: -5, color: "Salmon", label: "Slightly Negative" },
      { min: -5, max: 5, color: "Gray", label: "Neutral" },
      { min: 5, max: 25, color: "LightGreen", label: "Slightly Positive" },
      { min: 25, max: 50, color: "LimeGreen", label: "Positive" },
      { min: 50, max: 75, color: "Green", label: "Very Positive" },
      {
        min: 75,
        max: Infinity,
        color: "DarkGreen",
        label: "Extremely Positive",
      },
    ];

    data = sentimentRanges.map((range) => {
      const sentiments = histogram_sentiments.filter(
        (sentiment) => sentiment > range.min && sentiment <= range.max
      );

      return {
        x: sentiments,
        type: "histogram",
        nbinsx: 50,
        autobinx: false,
        opacity: 0.7,
        marker: {
          color: range.color,
        },
        name: range.label,
      };
    });
  } else if (plotType === "marker") {
    const baselineSentiment = {
      x: [submissionDate],
      y: [sentimentBaseline],
      mode: "markers",
      marker: { color: "#0077B6", size: 12 },
      name: "Baseline",
    };

    const positiveSentiments = sentiments.filter((sentiment) => sentiment >= 0);
    const positiveTimeStamps = timeStamps.filter(
      (_, index) => sentiments[index] >= 0
    );

    const positiveTrace = {
      x: positiveTimeStamps,
      y: positiveSentiments,
      mode: "markers",
      marker: { color: "#33CC33", size: 6 },
      name: "Positive Sentiment",
      type: "scatter",
    };

    // filter timestamps and sentiments for points below zero
    const negativeSentiments = sentiments.filter((sentiment) => sentiment < 0);
    const negativeTimeStamps = timeStamps.filter(
      (_, index) => sentiments[index] < 0
    );

    const negativeTrace = {
      x: negativeTimeStamps,
      y: negativeSentiments,
      mode: "markers",
      marker: { color: "#FF3333", size: 6 },
      name: "Negative Sentiment",
      type: "scatter",
    };

    data = [baselineSentiment, positiveTrace, negativeTrace];
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
      line: { shape: "spline", color: "blue" }, // Green Sheen
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
      bold: true,
    },
    title: {
      text:
        plotType === "line"
          ? "Sentiment Moving Average Over Time"
          : plotType === "marker"
          ? "Timeline of Sentiments"
          : "Distribution of Negative and Positive Sentiment Comments",
      font: {
        size: 18, // Increased font size
        color: textColor,
        family: "Arial, sans-serif",
        bold: true, // Made text bold
      },
      x: 0.5,
      y: 1.1, // Moved title further from plot
      xanchor: "center",
      yanchor: "top",
    },
    xaxis: {
      title: plotType === "histogram" ? "Sentiment Score" : "Time (UTC)",
      showgrid: false,
      zeroline: true,
      autorange: true,
    },
    yaxis: {
      title: plotType === "histogram" ? "Comment Count" : "Sentiment",
      font: {
        bold: true,
      },
      showline: false,
    },
  };
  const formatThreadTitle = (subreddit: string, postTitle: string) =>
    `Thread Title${subreddit}: ${postTitle}`;

  const threadTitle = formatThreadTitle(subreddit, postTitle);

  return (
    <Stack width="100%">
      <Flex direction="row" gap={8} alignItems="center" justifyContent="center">
        <Text fontSize="xs" color="gray.500">
          {threadTitle}
        </Text>
      </Flex>
      <Plot
        data={data}
        layout={layout}
        config={{ responsive: true }}
        revision={timeStamps.length}
      />
    </Stack>
  );
};

export default CommentSentimentPlot;
