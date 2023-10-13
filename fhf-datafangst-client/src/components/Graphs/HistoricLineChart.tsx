import { Box } from "@mui/material";
import { FC } from "react";
import { useAppSelector } from "store";
import {
  selectBenchmarkHistoric,
  selectBenchmarkMetric,
  selectBenchmarkXAxis,
} from "store/benchmark";
import ReactEChart from "echarts-for-react";


import { Theme } from "./ChartsTheme";

export const HistoricLineChart: FC = () => {
  const historic = useAppSelector(selectBenchmarkHistoric);
  const metric = useAppSelector(selectBenchmarkMetric);
  const xAxis = useAppSelector(selectBenchmarkXAxis);

  if (!historic) {
    return <></>;
  }
  const data = xAxis?.map((timestring, i) => {
    return [new Date(timestring), historic[i]];
  });
  const theme = {...Theme, backgroundColor: "#067593"}
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
