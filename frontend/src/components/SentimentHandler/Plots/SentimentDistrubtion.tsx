import Plot from "react-plotly.js";
import { Box } from "@chakra-ui/react";
import { populateLayout } from "../layout";
import { usePlotColors } from "./utils/usePlotColors";

interface SentimentDistrubtionPlotProps {
  sentiments_compound: number[];
}

export function SentimentDistributionPlot({
  sentiments_compound,
}: SentimentDistrubtionPlotProps) {
  const { textColor, bgColor } = usePlotColors();

  const layout = populateLayout(
    textColor,
    bgColor,
    "Distribution of Negative and Positive Sentiment Comments",
    "Sentiment Score",
    "Comment Count"
  );

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

  const data = sentimentRanges.map((range) => {
    const sentiments = sentiments_compound.filter(
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

  return (
    <Box width="100%">
      <Plot
        data={data}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: "100%" }}
      ></Plot>
    </Box>
  );
}
