import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import { VesselFilter } from "components/Filters/VesselFilter";
import { Vessel } from "generated/openapi";
import React, { FC } from "react";
import {
  useAppDispatch,
  useAppSelector,
  selectUser,
  selectUserVessels,
  setSelectedVessels,
  updateUser,
  selectVesselsByFiskeridirId,
} from "store";
import { VesselInfo } from "./VesselInfo";

interface ContentProps {
  vessels: Vessel[];
}

export const FollowList: FC = () => {
  const dispatch = useAppDispatch();
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const user = useAppSelector(selectUser);
  const selectedVessels = useAppSelector(selectUserVessels);

  const followList = user?.following.map(
    (fiskeriDirId) => vessels[fiskeriDirId],
  );

  const Content: FC<ContentProps> = (props: ContentProps) => {
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
                    ? user?.following?.filter(
                        (f) => f !== vessel?.fiskeridir.id,
                      )
                    : [...(user?.following ?? []), vessel?.fiskeridir.id];
                  const following = follow?.map((f) => vessels[f]) ?? [];
                  dispatch(
                    updateUser({
                      following,
                    }),
                  );
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

  const onChange = (vessels?: Vessel[]) => {
    if (vessels === undefined) {
      dispatch(setSelectedVessels([]));
      return;
    }
    dispatch(setSelectedVessels(vessels));
  };
  return (
    <Box sx={{}}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          color: "black",
          boxShadow: "none",
          borderColor: "primary.dark",
          borderRadius: "5px",
          padding: "5px",
          margin: "5px",
        }}
      >
        {followList && <Content vessels={followList} />}
      </Box>

      <Box sx={{ "& .MuiIconButton-root": { color: "text.secondary" } }}>
        <VesselFilter
          onChange={onChange}
          value={selectedVessels}
          useVirtualization={true}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          color: "black",
          boxShadow: "none",
          borderColor: "primary.dark",
          borderRadius: "5px",
          padding: "5px",
          margin: "5px",
        }}
      >
        {selectedVessels.length > 0 && <Content vessels={selectedVessels} />}
      </Box>
    </Box>
  );
};
