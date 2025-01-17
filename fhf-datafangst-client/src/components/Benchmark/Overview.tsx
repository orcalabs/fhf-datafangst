import { Box, Typography } from "@mui/material";
import {
  BenchmarkCards,
  HistoricalCatches,
  LocalLoadingProgress,
  SpeciesHistogram,
} from "components";
import { Ordering, TripSorting } from "generated/openapi";
import { FC, useEffect } from "react";
import {
  getBenchmarkData,
  getLandings,
  getTrips,
  selectBenchmarkNumHistoric,
  selectBenchmarkTimeSpan,
  selectBwUserProfile,
  selectTrips,
  selectTripsLoading,
  selectUser,
  selectVesselsByCallsign,
  selectVesselsByFiskeridirId,
  useAppDispatch,
  useAppSelector,
} from "store";

export const BenchmarkOverview: FC = () => {
  const dispatch = useAppDispatch();

  const profile = useAppSelector(selectBwUserProfile);
  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const vessels = useAppSelector(selectVesselsByCallsign);
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);
  const user = useAppSelector(selectUser);
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const benchmarkTimespan = useAppSelector(selectBenchmarkTimeSpan);

  const vesselInfo = profile?.fiskInfoProfile;
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const followVessels = user?.following.map((id) => fiskeridirVessels[id]);

  useEffect(() => {
    if (vessel) {
      dispatch(
        getTrips({
          vessels: [vessel],
          sorting: [TripSorting.StopDate, Ordering.Desc],
          limit: benchmarkHistoric,
          offset: 0,
        }),
      );
      dispatch(
        getLandings({
          vessels: [vessel],
          years: [benchmarkTimespan.startYear, benchmarkTimespan.endYear],
        }),
      );
    }
    if (followVessels) {
      followVessels.forEach((vessel) => {
        dispatch(
          getBenchmarkData({
            vessels: [vessel],
            sorting: [TripSorting.StopDate, Ordering.Desc],
            limit: benchmarkHistoric,
            offset: 0,
          }),
        );
      });
    }
  }, [vessel]);

  if (!vessel) {
    return <></>;
  }

  return (
    <>
      {tripsLoading && <LocalLoadingProgress />}
      {trips?.length && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <BenchmarkCards />
          <SpeciesHistogram />
          <HistoricalCatches />
        </Box>
      )}
      {!tripsLoading && !trips?.length && (
        <Box sx={{ display: "grid", placeItems: "center" }}>
          <Typography color="text.secondary" variant="h2">
            Fant ingen turer for ditt fartøy
          </Typography>
          <Typography sx={{ pt: 3 }} color="text.secondary" variant="h5">
            For å kunne gi deg statistikk for dine turer må du ha levert
            landingssedler eller ERS-meldinger.
          </Typography>
        </Box>
      )}
    </>
  );
};
