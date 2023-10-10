import { Box, Grid } from "@mui/material";
import { getBwProfile } from "api";
import { BenchmarkCard, BenchmarkCards } from "components";
import { Ordering, TripSorting } from "generated/openapi";
import { FC, useEffect, useState } from "react";
import { useAuth } from "oidc-react";
import { getTrips, selectBwUserProfile, selectIsLoggedIn, selectVesselsByCallsign, useAppDispatch, useAppSelector } from "store";

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
export const BenchmarkView: FC = () => {

  const { signIn } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const dispatch = useAppDispatch()

  
  if (!loggedIn){
    signIn()
  }
  
  if (!vessel){
    return <p>No vessel associated with this user</p>
  }

  useEffect(() => {
    dispatch(getTrips({
      vessels : [vessel],
      sorting : [TripSorting.StopDate, Ordering.Desc],
      limit: 10,
      offset: 0
    }))
  })
  return (
    <BenchmarkCards/>
  );
};
