import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import ReactEChart from "echarts-for-react";
import type { FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import chartsTheme from "~/app/chartsTheme";
import theme from "~/app/theme";
import { FishIcon } from "~/assets/icons";
import type {
  LandingCatchWeight,
  SpeciesFiskeridir,
} from "~/generated/openapi";
import {
  selectLandingCatchWeights,
  selectSpeciesFiskeridir,
  useAppSelector,
} from "~/store";
import { formatNumber, kilosOrTonsFormatter } from "~/utils";

export const CatchChart: FC = () => {
  const species = useAppSelector(selectSpeciesFiskeridir);

  const landingCatchWeights = useAppSelector(selectLandingCatchWeights);

  const barHeight = 26;
  const chartHeight = landingCatchWeights
    ? landingCatchWeights.length * barHeight + 100
    : 200;

  return (
    <Card
      variant="elevation"
      sx={{
        m: "auto",
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <CardHeader
        avatar={<FishIcon width={34} height={34} />}
        title={"Fangst"}
        slotProps={{
          title: {
            sx: {
              fontSize: "1.15rem",
              fontWeight: "bold",
              color: "#324F7C",
            },
          },
          avatar: {
            sx: {
              color: "#0045ad",
            },
          },
        }}
      />
      <CardContent sx={{}}>
        {landingCatchWeights && (
          <ReactEChart
            option={datasetOption(landingCatchWeights, species)}
            theme={chartsTheme}
            style={{ width: "100%", height: chartHeight }}
          />
        )}
      </CardContent>
    </Card>
  );
};

const datasetOption = (
  landingCatchWeights: LandingCatchWeight[],
  species: SpeciesFiskeridir[],
) => ({
  grid: {
    top: 0,
    left: 150,
    right: 50,
  },
  legend: { show: false },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter,
  },
  dataset: {
    source: [
      ["Art", "Kilo"],
      ...[...landingCatchWeights]
        .sort((a, b) => b.livingWeight - a.livingWeight)
        .map(({ speciesFiskeridirId, livingWeight }) => [
          species.find((group) => group.id === speciesFiskeridirId)?.name ??
            "Ukjent artsgruppe",
          livingWeight,
        ]),
    ],
  },

  xAxis: { type: "value", name: "Kilo", nameLocation: "center" },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      type: "bar",
      label: {
        show: true,
        position: "right",
        formatter: (params: any) => formatNumber(params.value[1]),
      },
      itemStyle: {
        color: (params: any) => {
          const colors = [
            "#5470C6",
            "#91CC75",
            "#FAC858",
            "#EE6666",
            "#73C0DE",
            "#3BA272",
          ];

          return colors[params.dataIndex % colors.length];
        },
      },
    },
  ],
});

interface TooltipParams {
  value: number[];
  color: string;
  seriesName: string;
  seriesIndex: number;
}
const formatter = (data: TooltipParams[]) => {
  const values = data[0].value;
  const tooltipContent = (
    <Box>
      <Typography
        sx={{
          m: 0,
          mb: 8,
          color: `${theme.palette.secondary.dark}`,
        }}
        variant="h3"
      >
        {values[0]}
      </Typography>
      {data.map((d, i) => (
        <Typography sx={{ m: 0 }} key={i}>
          <span
            style={{
              display: "inline-block",
              marginRight: 10,
              borderRadius: 10,
              width: 10,
              height: 10,
              backgroundColor: d.color,
            }}
          />
          <b>{d.seriesName}</b>{" "}
          {values[d.seriesIndex + 1]
            ? kilosOrTonsFormatter(values[d.seriesIndex + 1])
            : "-"}
        </Typography>
      ))}
    </Box>
  );

  return renderToStaticMarkup(tooltipContent);
};
