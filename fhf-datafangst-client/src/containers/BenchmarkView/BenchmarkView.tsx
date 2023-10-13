import { Box } from "@mui/material";
import {
  BenchmarkCards,
  BmHeader,
  BmHeaderMenuButtons,
  SpeciesHistogram,
} from "components";
import { Ordering, TripSorting } from "generated/openapi";
import { FC, useEffect } from "react";
import { useAuth } from "oidc-react";
import {
  getTrips,
  selectBwUserProfile,
  selectIsLoggedIn,
  selectVesselsByCallsign,
  useAppDispatch,
  useAppSelector,
} from "store";
import { useNavigate } from "react-router-dom";
import { selectBenchmarkNumHistoric } from "store/benchmark";

const GridContainer = (props: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "500px 1fr 500px",
      gridTemplateRows: "48px 56px 1fr 100px",
      position: "absolute",
      width: "100%",
      height: "100%",
    }}
  >
    {props.children}
  </Box>
);

const HeaderTrack = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 4,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

const HeaderButtonCell = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

export const BenchmarkView: FC = () => {
  const { signIn } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const numHistoric = useAppSelector(selectBenchmarkNumHistoric);

  if (!loggedIn) {
    signIn();
  }

  if (!vessel) {
    navigate("/");
    return <p>No vessel associated with this user</p>;
  }
  useEffect(() => {
    dispatch(
      getTrips({
        vessels: [vessel],
        sorting: [TripSorting.StopDate, Ordering.Desc],
        limit: numHistoric,
        offset: 0,
      }),
    );
  });
  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <BmHeader />
        </HeaderTrack>
        <HeaderButtonCell>
          <BmHeaderMenuButtons />
        </HeaderButtonCell>
      </GridContainer>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "primary.main",
        }}
      >
        <BenchmarkCards />
        <SpeciesHistogram />
      </Box>
    </>
  );
};
