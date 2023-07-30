import Plot from "react-plotly.js";
import { Box, Stack } from "@chakra-ui/react";
import { populateLayout } from "../layout";
import { usePlotColors } from "./utils/usePlotColors";

interface MovingAveragePlotProps {
  sentiments_MovAvg: number[];
  timeStamps_MovAvg: Date[];
}

export function MovingAveragePlot({
  sentiments_MovAvg,
  timeStamps_MovAvg,
}: MovingAveragePlotProps) {
  const sentimentLine = {
    x: sentiments_MovAvg,
    y: timeStamps_MovAvg,
    mode: "lines",
    line: { shape: "spline", color: "blue" },
    name: "Sentiment (Moving Average)",
  };

  const data = [sentimentLine];
  const { textColor, bgColor } = usePlotColors();

  const layout = populateLayout(
    textColor,
    bgColor,
    "Sentiment Moving Average Over Time",
    "Time (UTC)",
    "Sentiment Score"
  );

  return (
    <Stack width="100%">
      <Plot data={data} layout={layout} config={{ responsive: true }} />;
    </Stack>
  );
}
