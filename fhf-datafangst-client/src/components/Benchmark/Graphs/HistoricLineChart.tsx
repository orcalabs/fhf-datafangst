import { Box, Typography } from "@mui/material";
import chartsTheme from "app/chartsTheme";
import ReactEChart from "echarts-for-react";
import { FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HistoricParams } from "store";
import { dateFormat } from "utils";

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
      <ReactEChart option={opt} theme={chartsTheme} />
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
        sx={{
          p: 0,
          m: 0,
          mb: 8,
        }}
      >
        {dateFormat(date, "d/M/yy HH:mm")}
      </Typography>
      <Typography sx={{ m: 0 }}>
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
