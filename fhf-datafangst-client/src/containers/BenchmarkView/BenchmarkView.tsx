import { Box, Button, Typography } from "@mui/material";
import {
  BenchmarkCards,
  Header,
  SpeciesHistogram,
  LocalLoadingProgress,
  HistoricalCatches,
  DashboardMenu,
  FollowList,
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
  selectActiveDashboardMenu,
  DashboardViewState,
} from "store";
import { Ordering, TripSorting } from "generated/openapi";
import { HeaderButtonCell, HeaderTrack } from "containers";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import theme from "app/theme";

const GridContainer = (props: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gridTemplateRows: "48px 1fr",
      position: "absolute",
      width: "100%",
      height: "100%",
    }}
  >
    {props.children}
  </Box>
);

const GridMainArea = (props: any) => (
  <Box
    sx={{
      display: "flex",
      bgcolor: "#EDF0F3",
      gridColumnStart: 2,
      gridColumnEnd: 3,
      gridRowStart: 2,
      gridRowEnd: 3,
    }}
  >
    {props.children}
  </Box>
);

const MenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 3,
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
  const menuSelection = useAppSelector(selectActiveDashboardMenu);

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
        <MenuArea>
          <DashboardMenu />
        </MenuArea>
        <GridMainArea>
          {menuSelection === DashboardViewState.Overview && (
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
                  <Typography
                    sx={{ pt: 3 }}
                    color="text.secondary"
                    variant="h5"
                  >
                    For å kunne gi deg statistikk for dine turer må du ha levert
                    landingssedler eller ERS-meldinger.
                  </Typography>
                </Box>
              )}
            </>
          )}
          {menuSelection === DashboardViewState.Follow && <FollowList />}
        </GridMainArea>
      </GridContainer>
    </>
  );
};
