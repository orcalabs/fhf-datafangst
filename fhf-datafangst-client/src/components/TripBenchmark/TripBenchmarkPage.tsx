import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import chartsTheme from "app/chartsTheme";
import { fontStyle } from "app/theme";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import {
  DateFilter,
  DateRange,
} from "components/MainMenu/SearchFilters/DateFilter";
import { endOfYear, startOfYear } from "date-fns";
import ReactEChart from "echarts-for-react";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  getTripBenchmarks,
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

export const TripBenchmarkPage: FC = () => {
  const dispatch = useAppDispatch();
  const bench = useAppSelector(selectTripBenchmarks);
  const loading = useAppSelector(selectTripBenchmarksLoading);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(
      startOfYear(new Date(2023, 1, 1)),
      endOfYear(new Date(2023, 1, 1)),
    ),
  );

  useEffect(() => {
    dispatch(
      getTripBenchmarks({
        start: dateRange?.start,
        end: dateRange?.end,
      }),
    );
  }, [dateRange]);

  const totalDuration = useMemo(
    () =>
      bench
        ? createObjectDurationString({
            start: 0,
            end: bench.trips
              .map(
                (t) => new Date(t.end).getTime() - new Date(t.start).getTime(),
              )
              .sum(),
          })
        : undefined,
    [bench?.trips],
  );

  const avgFuelconsumption = bench
    ? bench.trips.reduce((a, b) => {
        if (b.fuelConsumption) {
          return a + b.fuelConsumption;
        } else {
          return 0;
        }
      }, 0) / bench.trips.length
    : 0;

  const avgWeightPerHour = bench
    ? bench.trips.reduce((a, b) => {
        if (b.weightPerHour) {
          return a + b.weightPerHour;
        } else {
          return 0;
        }
      }, 0) / bench.trips.length
    : 0;

  const avgWeightPerDistance = bench
    ? bench.trips.reduce((a, b) => {
        if (b.weightPerDistance) {
          return a + b.weightPerDistance;
        } else {
          return 0;
        }
      }, 0) / bench.trips.length
    : 0;

  const avgWeightPerFuel = bench
    ? bench.trips.reduce((a, b) => {
        if (b.weightPerFuel) {
          return a + b.weightPerFuel;
        } else {
          return 0;
        }
      }, 0) / bench.trips.length
    : 0;

  const generalChartOptions = {
    grid: {
      bottom: 80,
    },
    xAxis: {
      type: "time",
      name: "Dato",
    },
    // Removes name of series from tooltip
    series: [{ type: "line", encode: { tooltip: [1] } }],
    dataZoom: [
      {
        type: "inside",
      },
      {
        type: "slider",
        labelFormatter: (value: Date, _: string) => dateFormat(value, "d/M/Y"),
      },
    ],
  };

  return (
    <Stack spacing={3} sx={{ width: "100%", p: 3 }}>
      <Stack sx={{ width: "33%" }}>
        <Card variant="elevation" sx={{ bgcolor: "white", borderRadius: 2 }}>
          <CardContent>
            <DateFilter value={dateRange} onChange={setDateRange} />
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

              {bench.weightPerHour &&
                benchmarkItem(
                  "Weigth per Hour",
                  kilosOrTonsFormatter(bench.weightPerHour),
                )}
              {bench.weightPerDistance &&
                benchmarkItem(
                  "Weigth per Distance",
                  kilosOrTonsFormatter(bench.weightPerDistance),
                )}
              {bench.weightPerFuel &&
                benchmarkItem(
                  "Weight per Fuel",
                  kilosOrTonsFormatter(bench.weightPerFuel),
                )}
              {bench.fuelConsumption &&
                benchmarkItem(
                  "Fuel Consumption",
                  kilosOrTonsFormatter(bench.fuelConsumption * 1000),
                )}
            </CardContent>
          </Card>

          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            {/* Fuel Consumption */}
            <Grid item xs={6}>
              <ChartCard title="Drivstofforbruk">
                <ReactEChart
                  option={{
                    ...generalChartOptions,
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
                    dataset: {
                      dimensions: ["end", "fuelConsumption"],
                      source: bench?.trips,
                    },
                    tooltip: {
                      trigger: "axis",
                      valueFormatter: (fuel: number | null) =>
                        avgFuelconsumption > 1 && fuel
                          ? fuel.toFixed(2)
                          : fuel && (fuel * 1000).toFixed(2),
                    },
                  }}
                  theme={chartsTheme}
                />
              </ChartCard>
            </Grid>
            {/* Weight per ton fuel */}
            <Grid item xs={6}>
              <ChartCard title="Fangstvekt per tonn drivstoff">
                <ReactEChart
                  option={{
                    ...generalChartOptions,
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
            <Grid item xs={6}>
              <ChartCard title="Fangstvekt per time">
                <ReactEChart
                  option={{
                    ...generalChartOptions,
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
            <Grid item xs={6}>
              <ChartCard title="Fangstvekt per distanse">
                <ReactEChart
                  option={{
                    ...generalChartOptions,

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
                              kilosOrTonsFormatter(t.fuelConsumption * 1000)}
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
        <Typography variant="h4" fontStyle="italic">
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
        title={title}
        titleTypographyProps={{
          variant: "h4",
          color: "black",
          fontWeight: fontStyle.fontWeightSemiBold,
        }}
      />
      <CardContent sx={{ px: 0 }}>{children}</CardContent>
    </Card>
  );
};
