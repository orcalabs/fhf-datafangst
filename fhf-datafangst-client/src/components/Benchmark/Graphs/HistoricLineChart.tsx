import { Box, Typography } from "@mui/material";
import { FC } from "react";
import ReactEChart from "echarts-for-react";
import { dateFormat } from "utils";
import chartsTheme from "app/chartsTheme";
import { HistoricParams } from "store";
import { renderToStaticMarkup } from "react-dom/server";

const seriesEntry = {
  type: "line",
  datasetIndex: undefined,
  name: undefined,
  encode: {
    x: "date",
    y: "value",
  },
};

export const HistoricLineChart: FC<HistoricParams> = (props) => {
  const { vesselNames, dataset, metric } = props;
  const theme = { ...chartsTheme, backgroundColor: "#067593" };
  const opt = {
    xAxis: {
      type: "time",
      name: "Dato",
      axisLabel: {
        formatter: (timestamp: number) => dateFormat(timestamp, "d/M"),
      },
    },
    legend: {},
    yAxis: {
      type: "value",
      name: metric,
    },
    tooltip: {
      trigger: "axis",
      formatter,
    },
    dataset: [
      {
        source: dataset,
      },
      ...vesselNames.map((vesselName) => {
        return {
          transform: {
            type: "filter",
            config: { dimension: "vesselName", value: vesselName },
          },
        };
      }),
    ],
    series: vesselNames.map((name, i) => ({
      ...seriesEntry,
      name,
      datasetIndex: i + 1,
    })),
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
  const [date, vessel, weight] = data[0].value;

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
        <b>
          {vessel} {weight.toFixed(2)}
        </b>
      </Typography>
    </Box>
  );

  return renderToStaticMarkup(tooltipContent);
};
