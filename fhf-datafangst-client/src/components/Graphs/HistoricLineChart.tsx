import { Box } from "@mui/material";
import { FC } from "react";
import ReactEChart from "echarts-for-react";
import { Theme } from "./ChartsTheme";
import { dateFormat } from "utils";

interface HistoricLineChartProps {
  xAxis: string[];
  yAxis: number[];
  metric?: string;
}

export const HistoricLineChart: FC<HistoricLineChartProps> = (props) => {
  const { xAxis, yAxis, metric } = props;

  const data = xAxis?.map((timestring, i) => {
    return [new Date(timestring), yAxis[i]];
  });
  const theme = { ...Theme, backgroundColor: "#067593" };
  const opt = {
    xAxis: {
      type: "time",
      name: "Dato",
      axisLabel: {
        formatter: (timestamp: number) => dateFormat(timestamp, "M/d"),
      },
    },
    yAxis: {
      type: "value",
      name: metric,
    },
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        data,
        type: "line",
      },
    ],
  };

  return (
    <Box
      sx={{
        justifyContent: "end",
        alignItems: "center",
      }}
    >
      <ReactEChart option={opt} theme={theme} />
    </Box>
  );
};
