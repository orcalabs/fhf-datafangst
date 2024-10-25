import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import {
  DateFilter,
  DateRange,
} from "components/MainMenu/SearchFilters/DateFilter";
import { startOfYear } from "date-fns";
import { TripBenchmark } from "generated/openapi";
import { FC, useEffect, useMemo, useState } from "react";
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
  IntoDate,
  kilosOrTonsFormatter,
} from "utils";

export const TripBenchmarkPage: FC = () => {
  const dispatch = useAppDispatch();
  const bench = useAppSelector(selectTripBenchmarks);
  const loading = useAppSelector(selectTripBenchmarksLoading);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(startOfYear(new Date())),
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

  return (
    <Stack sx={{ padding: 2, marginInline: "auto" }}>
      <Stack>
        <Card
          variant="elevation"
          sx={{ p: 2, bgcolor: "white", borderRadius: 2 }}
        >
          <CardContent>
            <DateFilter value={dateRange} onChange={setDateRange} />
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {loading ? (
        <>Loading...</>
      ) : bench ? (
        <Stack>
          <Card variant="elevation" sx={{ bgcolor: "white", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h3" sx={{ marginBottom: 2 }}>
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

          <Stack gap={2}>
            {bench?.trips.map((t) => <TripBenchmarkCard key={t.id} trip={t} />)}
          </Stack>
        </Stack>
      ) : (
        <>Error</>
      )}
    </Stack>
  );
};

interface CardProps {
  trip: TripBenchmark;
}

const TripBenchmarkCard: FC<CardProps> = ({ trip }) => {
  return (
    <Card variant="elevation" sx={{ bgcolor: "white", borderRadius: 2 }}>
      <CardContent>
        <Stack gap={1}>
          {startToEnd(trip.start, trip.end)}
          {duration(createObjectDurationString(trip))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {trip.weightPerHour &&
          benchmarkItem(
            "Weigth per Hour",
            kilosOrTonsFormatter(trip.weightPerHour),
          )}
        {trip.weightPerDistance &&
          benchmarkItem(
            "Weigth per Distance",
            kilosOrTonsFormatter(trip.weightPerDistance),
          )}
        {trip.weightPerFuel &&
          benchmarkItem(
            "Weight per Fuel",
            kilosOrTonsFormatter(trip.weightPerFuel),
          )}
        {trip.fuelConsumption &&
          benchmarkItem(
            "Fuel Consumption",
            kilosOrTonsFormatter(trip.fuelConsumption * 1000),
          )}
      </CardContent>
    </Card>
  );
};

const benchmarkItem = (label: string, value: string) => (
  <Stack gap={1} direction="row">
    <Typography>{label}:</Typography>
    <Typography>{value}</Typography>
  </Stack>
);

const startToEnd = (start: IntoDate, end: IntoDate) => (
  <Stack direction="row">
    <SvgIcon>
      <CalendarMonthSharpIcon />
    </SvgIcon>
    <Typography>
      {dateFormat(start, "PPP")} - {dateFormat(end, "PPP")}
    </Typography>
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
