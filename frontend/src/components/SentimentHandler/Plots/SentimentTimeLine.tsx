import Plot from "react-plotly.js";
import { Box } from "@chakra-ui/react";
import { populateLayout } from "../layout";
import { usePlotColors } from "./utils/usePlotColors";

interface SentimentTimelinePlotProps {
  sentimentBaseline: number;
  submissionDate: Date;
  sentiments_compound: number[];
  timeStamps: Date[];
}

export function SentimentTimelinePlot({
  sentimentBaseline,
  submissionDate,
  sentiments_compound,
  timeStamps,
}: SentimentTimelinePlotProps) {
  const { textColor, bgColor } = usePlotColors();

  const layout = populateLayout(
    textColor,
    bgColor,
    "Sentiment Timeline",
    "Time (UTC)",
    "Sentiment Score"
  );

  const baselineSentiment = {
    x: [submissionDate],
    y: [sentimentBaseline],
    mode: "markers",
    marker: { color: "#0077B6", size: 12 },
    name: "Sentiment at Post",
  };

  const positiveSentiments = sentiments_compound.filter(
    (sentiment) => sentiment >= 0
  );
  const positiveTimeStamps = timeStamps.filter(
    (_, index) => sentiments_compound[index] >= 0
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
  const negativeSentiments = sentiments_compound.filter(
    (sentiment) => sentiment < 0
  );
  const negativeTimeStamps = timeStamps.filter(
    (_, index) => sentiments_compound[index] < 0
  );

  const negativeTrace = {
    x: negativeTimeStamps,
    y: negativeSentiments,
    mode: "markers",
    marker: { color: "#FF3333", size: 6 },
    name: "Negative Sentiment",
    type: "scatter",
  };

  const data = [baselineSentiment, positiveTrace, negativeTrace];

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
