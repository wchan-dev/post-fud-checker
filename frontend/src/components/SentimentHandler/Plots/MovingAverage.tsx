import Plot from "react-plotly.js";
import { Box, Stack } from "@chakra-ui/react";
import { populateLayout } from "../layout";
import { usePlotColors } from "./utils/usePlotColors";

interface MovingAveragePlotProps {
  sentimentBaseline: number;
  submissionDate: Date;
  sentiments_MovAvg: number[];
  timeStamps_MovAvg: Date[];
}

export function MovingAveragePlot({
  sentimentBaseline,
  submissionDate,
  sentiments_MovAvg,
  timeStamps_MovAvg,
}: MovingAveragePlotProps) {
  const baselineSentiment = {
    x: [submissionDate],
    y: [sentimentBaseline],
    mode: "markers",
    marker: { color: "#0077B6", size: 12 }, // Deep Blue
    name: "Sentiment at Post",
  };

  const baselineSentimentLine = {
    x: [submissionDate, timeStamps_MovAvg[0]],
    y: [sentimentBaseline, sentiments_MovAvg[0]],
    mode: "lines",
    line: { shape: "linear", color: "#90E0EF", dash: "dash" }, // Light Cyan
    name: "Post-Comment Gap",
  };

  const sentimentLine = {
    x: timeStamps_MovAvg,
    y: sentiments_MovAvg,
    mode: "lines",
    line: { shape: "spline", color: "blue" },
    name: "Sentiment (Moving Average)",
  };

  const data = [baselineSentiment, baselineSentimentLine, sentimentLine];
  const { textColor, bgColor } = usePlotColors();

  const layout = populateLayout(
    textColor,
    bgColor,
    "Sentiment Moving Average Over Time",
    "Time (UTC)",
    "Sentiment Score"
  );

  return (
    <Box width="100%">
      <Plot
        data={data}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: "100%" }}
      />
    </Box>
  );
}
