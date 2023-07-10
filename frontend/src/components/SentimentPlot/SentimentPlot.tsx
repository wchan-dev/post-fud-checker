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
  const [plotType, setPlotType] = useState<"line" | "histogram">("line");

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
  } else {
    data = [
      {
        x: timeStamps,
        y: sentiments,
        mode: "line",
      },
    ];
  }
  let layout;

  if (plotType === "line") {
    layout = {
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
        x: 0.5,
      },
      xaxis: {
        title: "Time",
        showgrid: false,
        zeroline: true,
        rangeselector: {
          x: 0.08,
          buttons: [
            {
              count: 1,
              label: "1d",
              step: "day",
              stepmode: "backward",
            },
            {
              count: 5,
              label: "5d",
              step: "day",
              stepmode: "backward",
            },
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward",
            },
            { step: "all" },
          ],
        },
      },
      yaxis: {
        title: "Sentiment",
        showline: false,
      },
      updatemenus: [
        {
          x: 0.07,
          y: 1.1,
          showactive: false,
          buttons: [
            {
              label: "Lines",
              method: "restyle",
              args: ["mode", "lines", [0]], // Trace index added in arguments list
            },
            {
              label: "Markers",
              method: "restyle",
              args: ["mode", "markers", [0]], // Trace index added in arguments list
            },
            {
              label: "Lines+Markers",
              method: "restyle",
              args: ["mode", "lines+markers", [0]], // Trace index added in arguments list
            },
          ],
        },
      ],
      margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 },
    };
  } else {
    layout = {
      autosize: true,
      plot_bgcolor: bgColor,
      paper_bgcolor: bgColor,
      font: {
        family: "Inter, sans-serif",
        size: 12,
        color: textColor,
      },
      title: {
        text: "Frequency Distribution of Comment Sentiment",
        font: {
          size: 14,
        },
        x: 0.5,
      },
      xaxis: {
        title: "Sentiment Score",
        showgrid: false,
        zeroline: true,
      },
      yaxis: {
        title: "Comment Count",
        showline: false,
      },
      margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 },
    };
  }

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
            setPlotType(event.target.value as "line" | "histogram")
          }
        >
          <option value="line">Line plot</option>
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
