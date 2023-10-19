import { Box, Button, Typography } from "@mui/material";
import {
  BenchmarkCards,
  Header,
  SpeciesHistogram,
  LocalLoadingProgress,
} from "components";
import { FC, useEffect } from "react";
import { useAuth } from "oidc-react";
import {
  getTrips,
  selectBenchmarkNumHistoric,
  selectBwUserProfile,
  selectIsLoggedIn,
  selectTrips,
  selectTripsLoading,
  selectVesselsByCallsign,
  useAppDispatch,
  useAppSelector,
} from "store";
import { Ordering, TripSorting } from "generated/openapi";
import { GridContainer, HeaderButtonCell, HeaderTrack } from "containers";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "app/theme";

const GridMainArea = (props: any) => (
  <Box
    sx={{
      display: "grid",
      bgcolor: "primary.main",
      gridColumnStart: 1,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 5,
    }}
  >
    {props.children}
  </Box>
);

export const BenchmarkView: FC = () => {
  const { signIn, isLoading, userData } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const trips = useAppSelector(selectTrips);
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const dispatch = useAppDispatch();
  const tripsLoading = useAppSelector(selectTripsLoading);
  const navigate = useNavigate();

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
    }
  }, [vessel]);

  if (!vessel) {
    return <></>;
  }

  if (!loggedIn && !isLoading && !userData) {
    signIn();
  }

  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <HeaderButtonCell>
          <Button
            sx={{
              borderRadius: 0,
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
              p: 3,
              height: "100%",
              color: "white",
              ":hover": {
                bgcolor: "secondary.dark",
                borderColor: "secondary.dark",
              },
              zIndex: 10000,
            }}
            onClick={() => navigate("/")}
            startIcon={<ArrowBackIos />}
          >
            <Typography variant="h6">Tilbake til kart</Typography>
          </Button>
        </HeaderButtonCell>
        <GridMainArea>
          {tripsLoading && <LocalLoadingProgress />}
          {trips?.length && (
            <Box>
              <BenchmarkCards />
              <SpeciesHistogram />
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
        </GridMainArea>
      </GridContainer>
    </>
  );
};
