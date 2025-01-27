import { ArrowBackIos } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import theme from "app/theme";
import {
  BenchmarkOverview,
  Company,
  DashboardMenu,
  FollowList,
  FuelPage,
  Header,
  TripBenchmarkPage,
} from "components";
import { HeaderButtonCell, HeaderTrack } from "containers";
import { useAuth } from "oidc-react";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  DashboardViewState,
  MenuViewState,
  selectActiveDashboardMenu,
  selectIsLoggedIn,
  setActiveDashboardMenu,
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

export interface Props {
  view?: DashboardViewState;
}

export const BenchmarkView: FC<Props> = ({ view }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { signIn, isLoading, userData } = useAuth();

  const loggedIn = useAppSelector(selectIsLoggedIn);
  const viewState = useAppSelector(selectActiveDashboardMenu);

  useEffect(() => {
    if (!view || view !== viewState) {
      dispatch(setActiveDashboardMenu(view ?? DashboardViewState.Overview));
    }
  }, [view, viewState]);

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
            onClick={() => navigate(`/${MenuViewState.Overview}`)}
            startIcon={<ArrowBackIos />}
          >
            <Typography variant="h6">Tilbake til kart</Typography>
          </Button>
        </HeaderButtonCell>
        <MenuArea>
          <DashboardMenu />
        </MenuArea>
        <GridMainArea>
          {viewState === DashboardViewState.Overview && <BenchmarkOverview />}
          {viewState === DashboardViewState.Benchmark && <TripBenchmarkPage />}
          {viewState === DashboardViewState.Follow && <FollowList />}
          {viewState === DashboardViewState.Company && <Company />}
          {viewState === DashboardViewState.Fuel && <FuelPage />}
        </GridMainArea>
      </GridContainer>
    </>
  );
};
