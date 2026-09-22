import { Box, Card, CardContent, Typography } from "@mui/material";
import ReactEChart from "echarts-for-react";
import type { FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import chartsTheme from "~/app/chartsTheme";
import theme from "~/app/theme";
import type { Delivery, SpeciesFiskeridir, Trip } from "~/generated/openapi";
import { selectSpeciesFiskeridir, selectTrips, useAppSelector } from "~/store";
import { kilosOrTonsFormatter } from "~/utils";

const sumObjectValues = (deliveries: Delivery[]) => {
  console.log(deliveries.length);
  const res: Record<number, number> = {};
  for (const d of deliveries) {
    for (const c of d.delivered) {
      res[c.speciesFiskeridirId] =
        (res[c.speciesFiskeridirId] ?? 0) + c.livingWeight;
    }
  }
  console.log(res);
  return res;
};

const getDictSortedOnValue = (obj: Record<number, number>) =>
  Object.keys(obj).sort((a: string, b: string) => obj[+b] - obj[+a]);

export const CatchChart: FC = () => {
  const trips = useAppSelector(selectTrips);
  const species = useAppSelector(selectSpeciesFiskeridir);

  const generateLandingData = (trips?: Trip[]) => {
    if (!trips) {
      return { data: {} };
    }
    console.log(trips.length);
    const data = sumObjectValues(trips.map((t) => t.delivery));
    for (const [key, value] of Object.entries(data)) {
      data[+key] = value;
    }

    return { data };
  };

  const { data } = generateLandingData(trips);
  const barHeight = 30;
  const chartHeight = data ? Object.keys(data).length * barHeight + 100 : 200;

  console.log(trips);

  return (
    <Card
      variant="elevation"
      sx={{
        m: "auto",
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: 500,
        }}
      >
        <Typography variant="h5" sx={{ fontSize: "1.2rem" }}>
          Fangst
        </Typography>
        {data && (
          <ReactEChart
            option={datasetOption(data, species)}
            theme={chartsTheme}
            style={{ width: "100%", height: chartHeight }}
          />
        )}
      </CardContent>
    </Card>
  );
};

const datasetOption = (
  a: Record<number, number>,
  species: SpeciesFiskeridir[],
) => ({
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
      ...getDictSortedOnValue(a).map((key) => [
        species.find((s: SpeciesFiskeridir) => s.id === parseInt(key))?.name,
        a[+key],
      ]),
    ],
  },

  xAxis: { type: "value", name: "Kilo" },
  yAxis: { type: "category", inverse: true },
  series: [
    {
      type: "bar",
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
