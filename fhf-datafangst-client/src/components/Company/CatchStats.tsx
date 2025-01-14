import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import chartsTheme from "app/chartsTheme";
import { fontStyle } from "app/theme";
import ReactEChart from "echarts-for-react";
import { OrgBenchmarkEntry } from "generated/openapi";
import { FC, ReactNode } from "react";
import {
  selectSpeciesGroupsMap,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "store";
import { toTitleCase } from "utils";

interface Props {
  vesselEntries: OrgBenchmarkEntry[];
}

export const CatchStats: FC<Props> = ({ vesselEntries }) => {
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const speciesGroupsMap = useAppSelector(selectSpeciesGroupsMap);

  const avgWeight = vesselEntries
    ? vesselEntries.reduce((a, b) => {
        if (b.landingTotalLivingWeight) {
          return a + b.landingTotalLivingWeight;
        } else {
          return 0;
        }
      }, 0) / vesselEntries.length
    : 0;

  const speciesGroupIds = Array.from(
    new Set(
      vesselEntries.flatMap((e) => e.species).map((s) => s.speciesGroupId),
    ),
  ).sort();
  const catchDataset: Record<string, number[]> = Object.fromEntries(
    speciesGroupIds.map((sg) => [sg, []]),
  );

  speciesGroupIds.forEach((sg) => {
    vesselEntries.forEach((ve) => {
      const found = ve.species.find((v) => v.speciesGroupId === sg);
      if (found) {
        catchDataset[found.speciesGroupId].push(found.landingTotalLivingWeight);
      } else {
        catchDataset[sg].push(0);
      }
    });
  });

  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid item xs={6}>
        <ChartCard title="Fangst">
          <ReactEChart
            option={{
              tooltip: {
                trigger: "axis",
                valueFormatter: (weight: number | null) =>
                  avgWeight > 1000 && weight
                    ? (weight / 1000).toFixed(2)
                    : weight && weight.toFixed(2),
              },
              dataset: {
                dimensions: ["fiskeridirVesselId", "landingTotalLivingWeight"],
                source: vesselEntries,
              },
              yAxis: {
                type: "value",
                name: avgWeight >= 1000 ? "Rundvekt (tonn)" : "Rundvekt (kg)",
                axisLabel: {
                  formatter: (weight: number) =>
                    avgWeight > 1000 ? weight / 1000 : weight,
                },
              },
              xAxis: {
                type: "category",
                axisLabel: {
                  formatter: (id: number) =>
                    toTitleCase(vesselsMap[id].fiskeridir.name),
                },
              },
              series: [
                {
                  type: "bar",
                  colorBy: "data",
                  encode: {
                    x: "fiskeridirVesselId",
                    y: "landingTotalLivingWeight",
                  },
                },
              ],
            }}
            theme={chartsTheme}
          />
        </ChartCard>
      </Grid>
      <Grid item xs={6}>
        <ChartCard title="Fangst, artsvis">
          <ReactEChart
            option={{
              grid: {
                top: 80,
              },
              xAxis: {
                type: "category",
                data: vesselEntries.map((e) => e.fiskeridirVesselId),
                axisLabel: {
                  formatter: (id: number) =>
                    toTitleCase(vesselsMap[id].fiskeridir.name),
                },
              },
              yAxis: {
                type: "value",
                name: avgWeight >= 1000 ? "Rundvekt (tonn)" : "Rundvekt (kg)",
                axisLabel: {
                  formatter: (weight: number) =>
                    avgWeight > 1000 ? weight / 1000 : weight,
                },
              },
              legend: {
                data: speciesGroupIds,
                formatter: (name: string) => speciesGroupsMap[name].name,
              },
              tooltip: {
                valueFormatter: (weight: number | null) =>
                  avgWeight > 1000 && weight
                    ? (weight / 1000).toFixed(2)
                    : weight && weight.toFixed(2),
              },
              series: Object.entries(catchDataset).map((e) => {
                return {
                  name: e[0],
                  type: "bar",
                  barGap: 0,
                  emphasis: {
                    focus: "series",
                  },
                  data: e[1],
                  encode: { tooltip: [1] },
                };
              }),
            }}
            theme={chartsTheme}
          />
        </ChartCard>
      </Grid>
      <Grid item xs={6}>
        <ChartCard title="Verdi">
          <ReactEChart option={{}} theme={chartsTheme} />
        </ChartCard>
      </Grid>
    </Grid>
  );
};

interface ChartCardProps {
  children: ReactNode;
  title: string;
}

const ChartCard: FC<ChartCardProps> = ({ children, title }) => {
  return (
    <Card variant="elevation" sx={{ bgcolor: "white", borderRadius: 2 }}>
      <CardHeader
        sx={{ pb: 1 }}
        title={title}
        titleTypographyProps={{
          variant: "h5",
          color: "black",
          fontWeight: fontStyle.fontWeightSemiBold,
        }}
      />
      <CardContent sx={{ px: 0, pb: "4px !important" }}>{children}</CardContent>
    </Card>
  );
};
