import { Box } from "@chakra-ui/react";
import Plot from "react-plotly.js";

const PlotContainer = () => {
  return (
    <Box>
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
          { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
        ]}
        layout={{ width: 1080, height: 720, title: "A Fancy Plot" }}
      />
    </Box>
  );
};

export default PlotContainer;
