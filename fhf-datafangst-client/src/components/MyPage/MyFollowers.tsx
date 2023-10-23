import { Box } from "@mui/material";
import { VesselFilter } from "components/Filters/VesselFilter";
import { Vessel } from "generated/openapi";
import { FC, useState } from "react";
import { useAppSelector, selectUser, selectVesselsByFiskeridirId } from "store";
import { FollowListItems } from "./FollowListItems";

export const FollowList: FC = () => {
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const user = useAppSelector(selectUser);
  const [selectedVessels, setSelectedVessels] = useState<Vessel[]>(); // useAppSelector(selectUserVessels);

  const followList = user?.following.map(
    (fiskeriDirId) => vessels[fiskeriDirId],
  );

  const onChange = (vessels?: Vessel[]) => {
    setSelectedVessels(vessels ?? []);
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
        {followList && <FollowListItems vessels={followList} />}
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
        {selectedVessels && selectedVessels.length > 0 && (
          <FollowListItems vessels={selectedVessels} />
        )}
      </Box>
    </Box>
  );
};
