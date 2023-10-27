import { Ordering, TripSorting, Vessel } from "generated/openapi";
import React, { FC } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import {
  clearBenchmarkData,
  getBenchmarkData,
  selectBenchmarkNumHistoric,
  selectUser,
  selectVesselsByFiskeridirId,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { useAuth } from "oidc-react";
import { VesselInfo } from "components/MyPage/VesselInfo";

interface ContentProps {
  vessels: Vessel[];
}

export const FollowListItems: FC<ContentProps> = (props: ContentProps) => {
  const { userData } = useAuth();
  const dispatch = useAppDispatch();
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const benchmarkHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const user = useAppSelector(selectUser);

  const updateFollowVessels = (vessel: Vessel, isFollowing?: number) => {
    if (!isFollowing) {
      dispatch(
        getBenchmarkData({
          vessels: [vessel],
          sorting: [TripSorting.StopDate, Ordering.Desc],
          limit: benchmarkHistoric,
          offset: 0,
        }),
      );
    } else {
      dispatch(clearBenchmarkData(vessel));
    }
  };

  if (!props) return <></>;
  const vesselComponents = props.vessels.map((vessel) => {
    const isFollowing = user?.following?.find(
      (f) => f === vessel?.fiskeridir.id,
    );
    return (
      <Box
        key={vessel.fiskeridir?.id}
        sx={{
          alignContent: "center",
          "& .MuiIconButton-root": {
            color: "white",
            px: 2,
            height: "100%",
            border: 0,
            borderRadius: 0,
            width: "100%",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.main" },
            },
            "&:hover": { bgcolor: "primary.dark" },
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={1} alignContent={"center"}>
            <IconButton
              onClick={() => {
                const follow = isFollowing
                  ? user?.following?.filter((f) => f !== vessel?.fiskeridir.id)
                  : [...(user?.following ?? []), vessel?.fiskeridir.id];
                const following = follow?.map((f) => vessels[f]) ?? [];
                dispatch(
                  updateUser({
                    following,
                    accessToken: userData?.access_token,
                  }),
                );
                updateFollowVessels(vessel, isFollowing);
              }}
            >
              {!isFollowing ? <PersonAdd /> : <PersonRemove />}
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <VesselInfo vessel={vessel} />
          </Grid>
        </Grid>
      </Box>
    );
  });

  return <React.Fragment> {vesselComponents} </React.Fragment>;
};
