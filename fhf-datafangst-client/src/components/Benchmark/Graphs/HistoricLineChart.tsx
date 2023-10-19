import { Box, Typography } from "@mui/material";
import { FC } from "react";
import ReactEChart from "echarts-for-react";
import { dateFormat } from "utils";
import chartsTheme from "app/chartsTheme";
import { BenchmarkModalParams } from "store";
import { renderToStaticMarkup } from "react-dom/server";

export const HistoricLineChart: FC<BenchmarkModalParams> = (props) => {
  const { xAxis, yAxis, metric } = props;

  const data = xAxis?.map((timestring, i) => {
    return [new Date(timestring), yAxis[i]];
  });
  const theme = { ...chartsTheme, backgroundColor: "#067593" };
  const opt = {
    xAxis: {
      type: "time",
      name: "Dato",
      axisLabel: {
        formatter: (timestamp: number) => dateFormat(timestamp, "d/M"),
      },
    },
    yAxis: {
      type: "value",
      name: metric,
    },
    tooltip: {
      trigger: "axis",
      formatter,
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

interface TooltipParams {
  value: number[];
  color: string;
}
const formatter = (data: TooltipParams[]) => {
  const [date, weight] = data[0].value;

  const tooltipContent = (
    <Box>
      <Typography
        style={{
          padding: 0,
          margin: 0,
          marginBottom: 8,
        }}
      >
        {dateFormat(date, "d/M/yy HH:mm")}
      </Typography>
      <Typography style={{ margin: 0 }}>
        <span
          style={{
            display: "inline-block",
            marginRight: 10,
            borderRadius: 10,
            width: 10,
            height: 10,
            backgroundColor: data[0].color,
          }}
        />
        <b>{weight}</b>
      </Typography>
    </Box>
  );

  return renderToStaticMarkup(tooltipContent);
};
