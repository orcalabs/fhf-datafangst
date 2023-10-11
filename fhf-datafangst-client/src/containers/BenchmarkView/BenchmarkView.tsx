import { Box, Grid } from "@mui/material";
import { getBwProfile } from "api";
import { BenchmarkCard, BenchmarkCards, BenchmarkModal, BmHeader, BmHeaderMenuButtons, Header, SpeciesHistogram } from "components";
import { Ordering, TripSorting } from "generated/openapi";
import { FC, useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { getTrips, selectBwUserProfile, selectIsLoggedIn, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";
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

const MenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}
  >
    {props.children}
  </Box>
);

const HaulMenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 3,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Box>
);

const FilterButtonArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

const MapAttributionsArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 3 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </Box>
);

const TimeSliderArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

const CenterArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      justifyContent: "flex-end",
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
  const num_historic = useAppSelector(selectBenchmarkNumHistoric)

  if (!loggedIn) {
    signIn();
  }

  if (!vessel) {
    navigate('/')
    return <p>No vessel associated with this user</p>;
  }
  useEffect(() => {
    dispatch(getTrips({
      vessels: [vessel],
      sorting: [TripSorting.StopDate, Ordering.Desc],
      limit: num_historic,
      offset: 0,
    }));
  });
  return (
    <>
    <GridContainer>
      <HeaderTrack>
        <BmHeader/>
      </HeaderTrack>
      <HeaderButtonCell>
          <BmHeaderMenuButtons />
      </HeaderButtonCell>
      {/* <MenuArea>
      </MenuArea> */}
    </GridContainer>
    <Box sx={{ height: "100vh", width: "100%", backgroundColor: "primary.main" }}>
      <BenchmarkCards/>
      <SpeciesHistogram />
      <BenchmarkModal/>

    </Box>
    </>
  );
};
