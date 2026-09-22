import { Box, Stack, Typography } from "@mui/material";
import { startOfYear } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { DateRange } from "~/api";
import { BenchmarkCards, DateFilter, LocalLoadingProgress } from "~/components";
import { Ordering, TripSorting } from "~/generated/openapi";
import {
  getAvgVesselBenchmark,
  getSumPerVesselBenchmark,
  getTrips,
  selectAccessToken,
  selectLoggedInVessel,
  selectTrips,
  selectTripsLoading,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { kilosOrTonsFormatter } from "~/utils";
import { GeneralStatsCard } from "./GeneralStatsCard";
import { CatchChart } from "./Graphs/CatchChart";
import { VesselRanking } from "./VesselRanking";

export const BenchmarkOverview: FC = () => {
  const dispatch = useAppDispatch();

  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const vessel = useAppSelector(selectLoggedInVessel);

  // TODO: Remove before push
  const token = useAppSelector(selectAccessToken);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(startOfYear(new Date()), new Date()),
  );

  const sumWeight = trips?.reduce(
    (sum, trip) => sum + trip.delivery.totalLivingWeight,
    0,
  );

  const sumHauls = trips?.reduce((sum, trip) => sum + trip.hauls.length, 0);

  useEffect(() => {
    if (vessel) {
      dispatch(
        getTrips({
          vessels: [vessel],
          sorting: [TripSorting.StopDate, Ordering.Desc],
          dateRange: dateRange,
          offset: 0,
          cancel: false,
        }),
      );
    }
  }, [vessel, dateRange]);

  useEffect(() => {
    // TODO: FIX forced values
    if (vessel) {
      dispatch(
        getAvgVesselBenchmark({
          callSignOverride: vessel?.fiskeridir.callSign,
          lengthGroups: [vessel.fiskeridir.lengthGroupId!],
          start: dateRange?.start,
          end: dateRange?.end,
          accessToken: token,
        }),
      );
      dispatch(
        getSumPerVesselBenchmark({
          callSignOverride: vessel?.fiskeridir.callSign,
          lengthGroups: [vessel.fiskeridir.lengthGroupId!],
          start: dateRange?.start,
          end: dateRange?.end,
          accessToken: token,
        }),
      );
    }
  }, [vessel, dateRange]);

  if (!vessel) {
    return <></>;
  }

  return (
    <>
      {tripsLoading && <LocalLoadingProgress />}

      <Box
        sx={{
          p: 2,
          display: "grid",
          width: "100%",
          height: "100%",
          gap: 3,
          gridTemplateColumns: "1fr 1fr 1fr 1fr 30%",
          gridTemplateRows: "1fr 1fr 1fr",
          gridTemplateAreas: `
              'generalA generalB generalC generalD date'
              'a a a a b'
              'c d d d b'
            `,
        }}
      >
        <Box sx={{ gridArea: "date" }}>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Box>
              <DateFilter
                value={dateRange}
                onChange={setDateRange}
                validateRange
                showShortCuts
              />
            </Box>
          </Stack>
        </Box>
        {!!trips?.length && (
          <>
            <Box sx={{ gridColumn: "1 / 3", gridRow: "1 / 4" }}>
              <Stack direction="row" spacing={2}>
                <GeneralStatsCard title="Antall turer" value={trips.length} />
                <GeneralStatsCard
                  title="Total rundvekt (levert)"
                  value={
                    sumWeight ? kilosOrTonsFormatter(sumWeight) : undefined
                  }
                />
                <GeneralStatsCard title="Antall hal" value={sumHauls} />
              </Stack>
            </Box>
            <Box sx={{ gridArea: "a" }}>
              <BenchmarkCards />
            </Box>
            <Box sx={{ gridArea: "c" }}>
              {/* <SpeciesHistogram /> */}
              <CatchChart />
            </Box>
            <Box sx={{ gridArea: "b" }}>
              <VesselRanking />
            </Box>
          </>
        )}
        {!tripsLoading && !trips?.length && (
          <Box sx={{ p: 1, gridColumn: "1 / 3", gridRow: "1 / 4" }}>
            <Typography variant="h4" sx={{ fontStyle: "italic" }}>
              Fant ingen turer for ditt fartøy på følgende tidsseleksjon
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
