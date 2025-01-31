import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import chartsTheme from "app/chartsTheme";
import { fontStyle } from "app/theme";
import ReactEChart from "echarts-for-react";
import { OrgBenchmarkEntry } from "generated/openapi";
import { FC, ReactNode } from "react";
import {
  selectOrgFuelConsumption,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "store";
import {
  createDurationFromSeconds,
  metersOrNauticalMilesFormatter,
  toTitleCase,
} from "utils";

interface Props {
  vesselEntries: OrgBenchmarkEntry[];
}

export const GeneralStats: FC<Props> = ({ vesselEntries }) => {
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const orgFuelConsumption = useAppSelector(selectOrgFuelConsumption);

  const avgDistance = vesselEntries
    ? vesselEntries.reduce((a, b) => {
        if (b.tripDistance) {
          return a + b.tripDistance;
        } else {
          return 0;
        }
      }, 0) / vesselEntries.length
    : 0;

  const avgFuelconsumption = orgFuelConsumption
    ? orgFuelConsumption.reduce((a, b) => {
        if (b.estimatedFuel) {
          return a + b.estimatedFuel;
        } else {
          return 0;
        }
      }, 0) / orgFuelConsumption.length
    : 0;

  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid item xs={6}>
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
      <Grid item xs={6}>
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
      <Grid item xs={6}>
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
      <Grid item xs={6}>
        <ChartCard title="Drivstofforbruk">
          {orgFuelConsumption && (
            <ReactEChart
              option={{
                tooltip: {
                  trigger: "axis",
                  valueFormatter: (fuel: number | null) =>
                    avgFuelconsumption > 1 && fuel
                      ? fuel.toFixed(2)
                      : fuel && (fuel * 1000).toFixed(2),
                },
                dataset: {
                  dimensions: ["fiskeridirVesselId", "estimatedFuel"],
                  source: orgFuelConsumption,
                },
                yAxis: {
                  type: "value",
                  name:
                    avgFuelconsumption > 1
                      ? "Drivstoff (tonn)"
                      : "Drivstoff (kg)",
                  axisLabel: {
                    formatter: (fuel: number) =>
                      avgFuelconsumption > 1 ? fuel : fuel * 1000,
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
