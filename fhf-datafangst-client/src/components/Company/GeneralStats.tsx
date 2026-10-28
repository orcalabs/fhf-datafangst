import { Card, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import ReactEChart from "echarts-for-react";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import chartsTheme from "~/app/chartsTheme";
import { fontStyle } from "~/app/theme";
import type { OrgBenchmarkEntry } from "~/generated/openapi";
import {
  selectOrgFuelConsumption,
  selectSpeciesGroupsMap,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "~/store";
import {
  createDurationFromSeconds,
  metersOrNauticalMilesFormatter,
  toTitleCase,
} from "~/utils";

interface Props {
  vesselEntries: OrgBenchmarkEntry[];
}

export const GeneralStats: FC<Props> = ({ vesselEntries }) => {
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const orgFuelConsumption = useAppSelector(selectOrgFuelConsumption);

  const avgDistance = useMemo(
    () =>
      vesselEntries.length
        ? vesselEntries.sum((v) => v.tripDistance) / vesselEntries.length
        : 0,
    [vesselEntries],
  );

  const speciesGroupsMap = useAppSelector(selectSpeciesGroupsMap);

  const { avgWeight, speciesGroupIds, catchDataset } = useMemo(() => {
    const avgWeight = vesselEntries.length
      ? vesselEntries.sum((v) => v.landingTotalLivingWeight) /
        vesselEntries.length
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
          catchDataset[found.speciesGroupId].push(
            found.landingTotalLivingWeight,
          );
        } else {
          catchDataset[sg].push(0);
        }
      });
    });

    return { avgWeight, speciesGroupIds, catchDataset };
  }, [vesselEntries]);

  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid size={6}>
        <ChartCard title="Tid på tokt">
          <ReactEChart
            option={{
              tooltip: {
                trigger: "axis",
                valueFormatter: (seconds: number | null) =>
                  seconds && createDurationFromSeconds(seconds),
              },
              dataset: {
                dimensions: ["fiskeridirVesselId", "tripTime"],
                source: vesselEntries,
              },
              yAxis: {
                type: "value",
                name: "Tid (timer)",
                axisLabel: {
                  formatter: (seconds: number) => Math.round(seconds / 3600),
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
                    y: "tripTime",
                  },
                },
              ],
            }}
            theme={chartsTheme}
          />
        </ChartCard>
      </Grid>
      <Grid size={6}>
        <ChartCard title="Aktivt fiske">
          <ReactEChart
            option={{
              tooltip: {
                trigger: "axis",
                valueFormatter: (seconds: number | null) =>
                  seconds && createDurationFromSeconds(seconds),
              },
              dataset: {
                dimensions: ["fiskeridirVesselId", "fishingTime"],
                source: vesselEntries,
              },
              yAxis: {
                type: "value",
                name: "Tid (timer)",
                axisLabel: {
                  formatter: (seconds: number) => Math.round(seconds / 3600),
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
                    y: "fishingTime",
                  },
                },
              ],
            }}
            theme={chartsTheme}
          />
        </ChartCard>
      </Grid>
      <Grid size={6}>
        <ChartCard title="Distanse">
          <ReactEChart
            option={{
              tooltip: {
                trigger: "axis",
                valueFormatter: (meters: number | null) =>
                  meters && avgDistance >= 1852
                    ? metersOrNauticalMilesFormatter(meters)
                    : meters,
              },
              dataset: {
                dimensions: ["fiskeridirVesselId", "tripDistance"],
                source: vesselEntries,
              },
              yAxis: {
                type: "value",
                name: avgDistance >= 1852 ? "Distanse (nm)" : "Distanse (m)",
                axisLabel: {
                  formatter: (distance: number) =>
                    avgDistance >= 1852
                      ? Math.round(distance / 1852)
                      : distance,
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
                    y: "tripDistance",
                    tooltip: ["tripDistance"],
                  },
                },
              ],
            }}
            theme={chartsTheme}
          />
        </ChartCard>
      </Grid>
      <Grid size={6}>
        <ChartCard title="Drivstofforbruk">
          {orgFuelConsumption && (
            <ReactEChart
              option={{
                tooltip: {
                  trigger: "axis",
                  valueFormatter: (fuel: number | null) => fuel?.toFixed(2),
                },
                dataset: {
                  dimensions: ["fiskeridirVesselId", "estimatedFuel"],
                  source: orgFuelConsumption,
                },
                yAxis: {
                  type: "value",
                  name: "Drivstoff (liter)",
                  axisLabel: {
                    formatter: (fuel: number) => fuel.toFixed(2),
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
                      y: "estimatedFuel",
                      tooltip: ["estimatedFuel"],
                    },
                  },
                ],
              }}
              theme={chartsTheme}
            />
          )}
        </ChartCard>
      </Grid>
      <Grid size={6}>
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
      <Grid size={6}>
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
        slotProps={{
          title: {
            variant: "h5",
            color: "black",
            fontWeight: fontStyle.fontWeightSemiBold,
          },
        }}
      />
      <CardContent sx={{ px: 0, pb: "4px !important" }}>{children}</CardContent>
    </Card>
  );
};
