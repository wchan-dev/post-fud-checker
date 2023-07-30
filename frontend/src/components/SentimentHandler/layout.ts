export function populateLayout(
  textColor: string,
  bgColor: string,
  plotTitle: string,
  xAxisTitle: string,
  yAxisTitle: string
) {
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
      text: plotTitle,
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
      title: xAxisTitle,
      showgrid: false,
      zeroline: true,
      autorange: true,
    },
    yaxis: {
      title: yAxisTitle,
      font: {
        bold: true,
      },
      showline: false,
    },
  };

  return layout;
}
