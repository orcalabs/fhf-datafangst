import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import type { DateRange } from "~/api";
import { BenchmarkCards, LocalLoadingProgress } from "~/components";
import { Ordering, TripSorting } from "~/generated/openapi";
import {
  getAvgVesselBenchmark,
  getSumPerVesselBenchmark,
  getTripBenchmarks,
  getTrips,
  selectAvgVesselBenchmark,
  selectLoggedInVessel,
  selectTripBenchmarks,
  selectTrips,
  selectTripsLoading,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { EEOI } from "./EEOI";
import { GeneralStatsCard } from "./GeneralStatsCard";
import { CatchChart } from "./Graphs/CatchChart";
import { VesselRanking } from "./VesselRanking";

interface Props {
  dateRange?: DateRange;
}

export const BenchmarkOverview: FC<Props> = ({ dateRange }) => {
  const dispatch = useAppDispatch();

  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const vessel = useAppSelector(selectLoggedInVessel);
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);
  const tripsBenchmarks = useAppSelector(selectTripBenchmarks);

  // TODO: Remove before push
  // const token = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (vessel) {
      dispatch(
        getTrips({
          vessels: [vessel],
          sorting: [TripSorting.StopDate, Ordering.Asc],
          dateRange: dateRange,
          offset: 0,
          cancel: false,
        }),
      );
    }
  }, [vessel, dateRange]);

  useEffect(() => {
    if (vessel) {
      dispatch(
        getAvgVesselBenchmark({
          callSignOverride: vessel?.fiskeridir.callSign,
          start: dateRange?.start,
          end: dateRange?.end,
        }),
      );
      dispatch(
        getSumPerVesselBenchmark({
          callSignOverride: vessel?.fiskeridir.callSign,
          start: dateRange?.start,
          end: dateRange?.end,
        }),
      );
      dispatch(
        getTripBenchmarks({
          start: dateRange?.start,
          end: dateRange?.end,
          ordering: Ordering.Asc,
          callSignOverride: vessel?.fiskeridir.callSign,
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
          gridTemplateColumns: "1fr auto 25%",
          gridTemplateRows: "auto 1fr 1fr",
          gridTemplateAreas: `
              'general general rank'
              'kpi eeoi rank'
              'chart chart rank'
            `,
        }}
      >
        {!!trips?.length && (
          <>
            <Box sx={{ gridColumn: "1 / 3", gridRow: "1 / 1" }}>
              <GeneralStatsCard trips={trips} />
            </Box>
            <Box sx={{ gridArea: "kpi" }}>
              <BenchmarkCards />
            </Box>
            <Box sx={{ gridArea: "chart" }}>
              <CatchChart />
            </Box>
            <Box sx={{ gridArea: "rank" }}>
              <VesselRanking />
            </Box>
            <Box sx={{ gridColumn: "2 / 3", gridRow: "2 / 2" }}>
              <EEOI
                tripBenchmarks={tripsBenchmarks}
                avgVesselBenchmark={avgVesselBenchmark}
                trips={trips}
              />
            </Box>
          </>
        )}
        {!tripsLoading && !trips?.length && (
          <Box sx={{ gridColumn: "1 / 3", gridRow: "1 / 4" }}>
            <Typography sx={{ fontStyle: "italic", fontSize: "1.3rem" }}>
              Fant ingen data for ditt fartøy på følgende tidsseleksjon
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
