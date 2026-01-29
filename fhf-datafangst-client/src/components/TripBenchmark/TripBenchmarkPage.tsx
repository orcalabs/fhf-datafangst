import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import chartsTheme from "app/chartsTheme";
import theme, { fontStyle } from "app/theme";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import { DateFilter, DateRange } from "components/SearchFilters/DateFilter";
import { startOfYear } from "date-fns";
import ReactEChart from "echarts-for-react";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  getAverageEeoi,
  getAverageTripBenchmarks,
  getEeoi,
  getEstimatedFuelConsumption,
  getTripBenchmarks,
  selectAverageEeoi,
  selectAverageTripBenchmarks,
  selectEeoi,
  selectEstimatedFuelConsumption,
  selectLoggedInVessel,
  selectTripBenchmarks,
  selectTripBenchmarksLoading,
  useAppDispatch,
  useAppSelector,
} from "store";
import {
  createObjectDurationString,
  dateFormat,
  kilosOrTonsFormatter,
} from "utils";

const nok = new Intl.NumberFormat("no-NB", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

export const TripBenchmarkPage: FC = () => {
  const dispatch = useAppDispatch();

  const bench = useAppSelector(selectTripBenchmarks);
  const loading = useAppSelector(selectTripBenchmarksLoading);
  const averageTripBenchmarks = useAppSelector(selectAverageTripBenchmarks);
  const vessel = useAppSelector(selectLoggedInVessel);
  const eeoi = useAppSelector(selectEeoi);
  const averageEeoi = useAppSelector(selectAverageEeoi);
  const totalFuelConsumption = useAppSelector(selectEstimatedFuelConsumption);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(startOfYear(new Date()), new Date()),
  );

  useEffect(() => {
    dispatch(
      getTripBenchmarks({
        start: dateRange?.start,
        end: dateRange?.end,
        callSignOverride: vessel?.fiskeridir.callSign,
      }),
    );

    dispatch(
      getEeoi({
        start: dateRange?.start,
        end: dateRange?.end,
        callSignOverride: vessel?.fiskeridir.callSign,
      }),
    );

    dispatch(
      getEstimatedFuelConsumption({
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        callSignOverride: vessel?.fiskeridir.callSign,
      }),
    );

    if (dateRange?.start && dateRange?.end) {
      dispatch(
        getAverageTripBenchmarks({
          startDate: dateRange.start,
          endDate: dateRange.end,
          gearGroups: vessel?.gearGroups,
          lengthGroup: vessel?.fiskeridir.lengthGroupId,
        }),
      );

      dispatch(
        getAverageEeoi({
          startDate: dateRange.start,
          endDate: dateRange.end,
          gearGroups: vessel?.gearGroups,
          lengthGroup: vessel?.fiskeridir.lengthGroupId,
        }),
      );
    }
  }, [dateRange, vessel]);

  const totalDuration = useMemo(
    () =>
      bench
        ? createObjectDurationString({
            start: 0,
            end: bench.trips.sum(
              (t) => new Date(t.end).getTime() - new Date(t.start).getTime(),
            ),
          })
        : undefined,
    [bench?.trips],
  );

  const { avgWeightPerHour, avgWeightPerDistance, avgWeightPerFuel } = useMemo(
    () =>
      bench?.trips.length
        ? {
            avgWeightPerHour:
              bench.trips.sum((v) => v.weightPerHour ?? 0) / bench.trips.length,
            avgWeightPerDistance:
              bench.trips.sum((v) => v.weightPerDistance ?? 0) /
              bench.trips.length,
            avgWeightPerFuel:
              bench.trips.sum((v) => v.weightPerFuel ?? 0) / bench.trips.length,
          }
        : {
            avgWeightPerHour: 0,
            avgWeightPerDistance: 0,
            avgWeightPerFuel: 0,
          },
    [bench?.trips],
  );

  const generalChartOptions = (
    average: number | null | undefined,
    markLineLabel?: string,
  ) => {
    return {
      grid: {
        bottom: 80,
      },
      xAxis: {
        type: "time",
        name: "Dato",
      },
      // Removes name of series from tooltip and add mark line for average
      series: [
        {
          type: "line",
          encode: { tooltip: [1] },
          markLine: {
            emphasis: {
              disabled: true,
            },
            lineStyle: {
              color: theme.palette.fourth.main,
              type: "dashed",
              width: 1.5,
            },
            label: {
              formatter: (_: any) => markLineLabel,
            },
            data: average ? [{ yAxis: average }] : [],
            symbol: "none",
          },
        },
      ],
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
          labelFormatter: (value: Date, _: string) =>
            dateFormat(value, "d/M/y"),
        },
      ],
    };
  };

  const markLineLabelFormatter = (
    value: number | null | undefined,
    conversion?: "tonsToKilos" | "kilosToTons",
  ) => {
    if (!value) {
      return "";
    }

    if (conversion === "tonsToKilos") {
      return (value * 1000).toFixed(2);
    } else if (conversion === "kilosToTons") {
      return (value / 1000).toFixed(2);
    } else {
      return value.toFixed(2);
    }
  };

  return (
    <Stack spacing={3} sx={{ width: "100%", p: 3, minHeight: 600 }}>
      <Stack sx={{ width: 520 }}>
        <Card variant="elevation" sx={{ bgcolor: "white", borderRadius: 2 }}>
          <CardContent>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              validateRange
              showShortCuts
            />
          </CardContent>
        </Card>
      </Stack>

      {loading ? (
        <Stack>
          <LocalLoadingProgress color="primary.light" />
        </Stack>
      ) : bench ? (
        <Stack>
          <Card
            variant="elevation"
            sx={{ bgcolor: "white", borderRadius: 2, width: "33%" }}
          >
            <CardContent>
              <Typography variant="h3" sx={{ pb: 2 }}>
                Total
              </Typography>

              {duration(totalDuration!)}

              <Divider sx={{ my: 2 }} />

              {!!eeoi && (
                <Stack gap={1} direction="row">
                  <Typography>EEOI (gCO2/t.nm): </Typography>
                  <Typography>
                    <span
                      style={{
                        color:
                          averageEeoi && eeoi > averageEeoi
                            ? "red"
                            : averageEeoi && eeoi < averageEeoi
                              ? "green"
                              : "black",
                      }}
                    >
                      {(eeoi * 1_000_000).toFixed(1)}
                    </span>
                    {averageEeoi && (
                      <> (avg: {(averageEeoi * 1_000_000).toFixed(1)})</>
                    )}
                  </Typography>
                </Stack>
              )}

              {bench.weightPerHour !== null &&
                benchmarkItem(
                  "Rundvekt per time",
                  kilosOrTonsFormatter(bench.weightPerHour),
                )}
              {bench.weightPerDistance !== null &&
                benchmarkItem(
                  "Rundvekt per distanse",
                  kilosOrTonsFormatter(bench.weightPerDistance),
                )}
              {bench.weightPerFuel !== null &&
                benchmarkItem(
                  "Rundvekt per liter drivstoff",
                  bench.weightPerFuel.toFixed(1),
                )}
              {bench.catchValuePerFuel !== null &&
                benchmarkItem(
                  "Fangstverdi per liter drivstoff",
                  nok.format(bench.catchValuePerFuel),
                )}
              {bench.fuelConsumption !== null &&
                benchmarkItem(
                  "Drivstofforbruk (tokt)",
                  bench.fuelConsumption.toFixed(0) + " liter",
                )}
              {totalFuelConsumption &&
                benchmarkItem(
                  "Drivstofforbruk (total)",
                  totalFuelConsumption.toFixed(0) + " liter",
                )}
            </CardContent>
          </Card>

          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            {/* Fuel Consumption */}
            <Grid size={6}>
              <ChartCard title="Drivstofforbruk">
                <ReactEChart
                  option={{
                    legend: {},
                    ...generalChartOptions(
                      averageTripBenchmarks?.fuelConsumption,
                      markLineLabelFormatter(
                        averageTripBenchmarks?.fuelConsumption,
                      ),
                    ),
                    yAxis: {
                      type: "value",
                      name: "Drivstoff (liter)",
                      axisLabel: {
                        formatter: (fuel: number) => fuel.toFixed(0),
                      },
                      max: (val: any) =>
                        averageTripBenchmarks?.fuelConsumption &&
                        averageTripBenchmarks.fuelConsumption > val.max
                          ? Math.ceil(averageTripBenchmarks.fuelConsumption)
                          : undefined,
                    },
                    dataset: {
                      dimensions: ["end", "fuelConsumption"],
                      source: bench?.trips,
                    },
                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (fuel: number | null) => fuel?.toFixed(2),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* Weight per ton fuel */}
            <Grid size={6}>
              <ChartCard title="Fangstvekt per liter drivstoff">
                <ReactEChart
                  option={{
                    ...generalChartOptions(
                      averageTripBenchmarks?.weightPerFuel,
                      markLineLabelFormatter(
                        averageTripBenchmarks?.weightPerFuel,
                        avgWeightPerFuel > 1000 ? "kilosToTons" : undefined,
                      ),
                    ),
                    yAxis: {
                      type: "value",
                      name:
                        avgWeightPerFuel > 1000
                          ? "Fangst (tonn)"
                          : "Fangst (kg)",
                      axisLabel: {
                        formatter: (weight: number) =>
                          avgWeightPerFuel > 1000 ? weight / 1000 : weight,
                      },
                      max: (val: any) =>
                        averageTripBenchmarks?.weightPerFuel &&
                        averageTripBenchmarks.weightPerFuel > val.max
                          ? Math.ceil(averageTripBenchmarks.weightPerFuel)
                          : undefined,
                    },
                    dataset: {
                      dimensions: ["end", "weightPerFuel"],
                      source: bench?.trips,
                    },

                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (weight: number | null) =>
                        avgWeightPerFuel > 1000 && weight
                          ? (weight / 1000).toFixed(2)
                          : weight && weight.toFixed(2),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* Weight per hour */}
            <Grid size={6}>
              <ChartCard title="Fangstvekt per time">
                <ReactEChart
                  option={{
                    ...generalChartOptions(
                      averageTripBenchmarks?.weightPerHour,
                      markLineLabelFormatter(
                        averageTripBenchmarks?.weightPerHour,
                        avgWeightPerHour > 1000 ? "kilosToTons" : undefined,
                      ),
                    ),
                    yAxis: {
                      type: "value",
                      name:
                        avgWeightPerHour > 1000
                          ? "Fangst (tonn)/time"
                          : "Fangst (kg)/time",
                      axisLabel: {
                        formatter: (weight: number) =>
                          avgWeightPerHour > 1000 ? weight / 1000 : weight,
                      },
                      max: (val: any) =>
                        averageTripBenchmarks?.weightPerHour &&
                        averageTripBenchmarks.weightPerHour > val.max
                          ? Math.ceil(averageTripBenchmarks.weightPerHour)
                          : undefined,
                    },
                    dataset: {
                      dimensions: ["end", "weightPerHour"],
                      source: bench?.trips,
                    },

                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (weight: number | null) =>
                        avgWeightPerHour > 1000 && weight
                          ? (weight / 1000).toFixed(2)
                          : weight && weight.toFixed(2),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* Weight per distance */}
            <Grid size={6}>
              <ChartCard title="Fangstvekt per distanse">
                <ReactEChart
                  option={{
                    ...generalChartOptions(
                      averageTripBenchmarks?.weightPerDistance,
                      markLineLabelFormatter(
                        averageTripBenchmarks?.weightPerDistance,
                        avgWeightPerDistance > 1000 ? "kilosToTons" : undefined,
                      ),
                    ),

                    yAxis: {
                      type: "value",
                      name:
                        avgWeightPerDistance > 1000
                          ? "Fangst (tonn)/m"
                          : "Fangst (kg)/m",
                      axisLabel: {
                        formatter: (weight: number) =>
                          avgWeightPerDistance > 1000 ? weight / 1000 : weight,
                      },
                      max: (val: any) =>
                        averageTripBenchmarks?.weightPerDistance &&
                        averageTripBenchmarks.weightPerDistance > val.max
                          ? Math.ceil(averageTripBenchmarks.weightPerDistance)
                          : undefined,
                    },
                    dataset: {
                      dimensions: ["end", "weightPerDistance"],
                      source: bench?.trips,
                    },

                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (weight: number | null) =>
                        avgWeightPerDistance > 1000 && weight
                          ? (weight / 1000).toFixed(2)
                          : weight && weight.toFixed(2),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* Price per fuel */}
            <Grid size={6}>
              <ChartCard title="Fangstverdi per liter drivstoff">
                <ReactEChart
                  option={{
                    ...generalChartOptions(
                      averageTripBenchmarks?.catchValuePerFuel,
                      averageTripBenchmarks?.catchValuePerFuel
                        ? nok.format(averageTripBenchmarks?.catchValuePerFuel)
                        : "",
                    ),

                    yAxis: {
                      type: "value",
                      name: "Verdi (NOK)",
                    },
                    dataset: {
                      dimensions: ["end", "catchValuePerFuel"],
                      source: bench?.trips,
                    },

                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (value: number | null) =>
                        value !== null && nok.format(value),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* EEOI */}
            <Grid size={6}>
              <ChartCard title="EEOI per tur">
                <ReactEChart
                  option={{
                    grid: {
                      bottom: 80,
                    },
                    xAxis: {
                      type: "time",
                      name: "Dato",
                    },
                    // Removes name of series from tooltip and add mark line for average
                    series: [
                      {
                        type: "line",
                        encode: { tooltip: [1] },
                      },
                    ],
                    dataZoom: [
                      {
                        type: "inside",
                      },
                      {
                        type: "slider",
                        labelFormatter: (value: Date, _: string) =>
                          dateFormat(value, "d/M/y"),
                      },
                    ],

                    yAxis: {
                      type: "value",
                      name: "EEOI (gCO2/t.nm)",
                      axisLabel: {
                        formatter: (eeoi: number) => eeoi * 1_000_000,
                      },
                    },
                    dataset: {
                      source: bench?.trips,
                      dimensions: ["end", "eeoi"],
                    },

                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (eeoi: number) =>
                        (eeoi * 1_000_000).toFixed(4),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
          </Grid>
          {process.env.REACT_APP_ENV === "staging" ? (
            <>
              <Divider sx={{ my: 2 }} />
              <Card
                variant="elevation"
                sx={{ bgcolor: "white", borderRadius: 2, width: "70%" }}
              >
                <CardContent>
                  <Table
                    sx={{
                      "& .MuiTableCell-head": {
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell align="right">Fuel Consumption</TableCell>
                        <TableCell align="right">Weight Per Hour</TableCell>
                        <TableCell align="right">Weight Per Distance</TableCell>
                        <TableCell align="right">Weight Per Fuel</TableCell>
                        <TableCell align="right">EEOI</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bench?.trips.map((t, i) => (
                        <TableRow key={i}>
                          <TableCell>{dateFormat(t.start, "PP")}</TableCell>
                          <TableCell>{dateFormat(t.end, "PP")}</TableCell>
                          <TableCell>{createObjectDurationString(t)}</TableCell>
                          <TableCell align="right">
                            {t.fuelConsumption &&
                              t.fuelConsumption.toFixed(0) + " liter"}
                          </TableCell>
                          <TableCell align="right">
                            {t.weightPerHour &&
                              kilosOrTonsFormatter(t.weightPerHour)}
                          </TableCell>
                          <TableCell align="right">
                            {t.weightPerDistance &&
                              kilosOrTonsFormatter(t.weightPerDistance)}
                          </TableCell>
                          <TableCell align="right">
                            {t.weightPerFuel &&
                              kilosOrTonsFormatter(t.weightPerFuel)}
                          </TableCell>
                          <TableCell align="right">
                            {t.eeoi && (t.eeoi * 1_000_000).toFixed(5)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <></>
          )}
        </Stack>
      ) : (
        <Typography variant="h6" fontStyle="italic">
          Finner ingen data for valgt tidsperiode
        </Typography>
      )}
    </Stack>
  );
};

const benchmarkItem = (label: string, value: string) => (
  <Stack gap={1} direction="row">
    <Typography>{label}:</Typography>
    <Typography>{value}</Typography>
  </Stack>
);

const duration = (value: string) => (
  <Stack direction="row">
    <SvgIcon>
      <TimerSharpIcon />
    </SvgIcon>
    <Typography>{value}</Typography>
  </Stack>
);

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
            variant: "h4",
            color: "black",
            fontWeight: fontStyle.fontWeightSemiBold,
          },
        }}
      />
      <CardContent sx={{ px: 0 }}>{children}</CardContent>
    </Card>
  );
};
