import { Box } from "@mui/material";
import { FC } from "react";
import { useAppSelector } from "store";
import { Graph } from "./Graph";
import {
  selectBenchmarkHistoric,
  selectBenchmarkMetric,
  selectBenchmarkXAxis,
} from "store/benchmark";

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

  const theme = {};
  const opt = {
    xAxis: {
      type: "time",
      name: "Dato",
      axisLabel: {
        formatter: (timestamp: number) => {
          const date = new Date(timestamp);
          return date.getMonth().toString() + "/" + date.getDate().toString();
        },
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
      <Graph options={opt} theme={theme} />
    </Box>
  );
};
