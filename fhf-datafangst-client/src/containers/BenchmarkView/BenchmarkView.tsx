import { ArrowBackIos } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import theme from "app/theme";
import {
  BenchmarkCards,
  DashboardMenu,
  FollowList,
  FuelPage,
  Header,
  HistoricalCatches,
  LocalLoadingProgress,
  SpeciesHistogram,
  TripBenchmarkPage,
} from "components";
import { HeaderButtonCell, HeaderTrack } from "containers";
import { Ordering, TripSorting } from "generated/openapi";
import { useAuth } from "oidc-react";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardViewState,
  getBenchmarkData,
  getLandings,
  getTrips,
  MenuViewState,
  selectActiveDashboardMenu,
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
} from "store";

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
      overflowY: "auto",
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
          {menuSelection === DashboardViewState.Benchmark && (
            <TripBenchmarkPage />
          )}
          {menuSelection === DashboardViewState.Follow && <FollowList />}
          {menuSelection === DashboardViewState.Fuel && <FuelPage />}
        </GridMainArea>
      </GridContainer>
    </>
  );
};
