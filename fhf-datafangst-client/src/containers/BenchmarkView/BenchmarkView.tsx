import { Box, Button, Drawer, Typography } from "@mui/material";
import {
  BenchmarkCards,
  Header,
  SpeciesHistogram,
  LocalLoadingProgress,
  FollowList,
  HistoricalCatches
} from "components";
import { FC, useEffect } from "react";
import { useAuth } from "oidc-react";
import {
  MenuViewState,
  getBenchmarkData,
  getTrips,
  selectBenchmarkNumHistoric,
  selectBenchmarkTimeSpan,
  selectBwUserProfile,
  selectIsLoggedIn,
  selectTrips,
  selectTripsLoading,
  selectUser,
  selectVesselsByCallsign,
  selectVesselsByFiskeridirId,
  setViewState,
  useAppDispatch,
  useAppSelector,
  getLandings,
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
      gridColumnStart: 2,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 5,
    }}
  >
    {props.children}
  </Box>
);

const FollowerArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 1,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      overflowY: "hidden",
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
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const trips = useAppSelector(selectTrips);
  const user = useAppSelector(selectUser);
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const benchmarkTimespan = useAppSelector(selectBenchmarkTimeSpan);
  const dispatch = useAppDispatch();
  const tripsLoading = useAppSelector(selectTripsLoading);
  const navigate = useNavigate();

  const followVessels = user?.following.map((id) => fiskeridirVessels[id]);

  useEffect(() => {
    dispatch(setViewState(MenuViewState.Benchmark));
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
            onClick={() => {
              dispatch(setViewState(MenuViewState.Overview));
              navigate("/");
            }}
            startIcon={<ArrowBackIos />}
          >
            <Typography variant="h6">Tilbake til kart</Typography>
          </Button>
        </HeaderButtonCell>
        <FollowerArea>
          <Drawer
            variant="permanent"
            sx={{
              height: "100%",
              "& .MuiDrawer-paper": {
                width: 500,
                position: "relative",
                boxSizing: "border-box",
                bgcolor: "primary.main",
                color: "white",
                flexShrink: 0,
                height: "100vh",
              },
              "& .MuiOutlinedInput-root": { borderRadius: 0 },
            }}
          >
            <Typography color={"white"} variant="h5" sx={{ padding: "10px" }}>
              FØLGELISTE
            </Typography>
            <FollowList />
          </Drawer>
        </FollowerArea>
        <GridMainArea>
          {tripsLoading && <LocalLoadingProgress />}
          {trips?.length && (
            <Box>
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
        </GridMainArea>
      </GridContainer>
    </>
  );
};
