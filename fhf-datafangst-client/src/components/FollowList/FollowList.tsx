import { Box } from "@mui/material";
import { VesselFilter } from "components/Filters/VesselFilter";
import { Vessel } from "generated/openapi";
import { FC, useState } from "react";
import { useAppSelector, selectUser, selectVesselsByFiskeridirId } from "store";
import { FollowListItems } from "./FollowListItems";

interface Props {
  onChange?: (vessel: Vessel, isFollowing?: number) => void;
}
export const FollowList: FC<Props> = (props) => {
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const user = useAppSelector(selectUser);
  const [selectedVessels, setSelectedVessels] = useState<Vessel[]>();

  const followList = user?.following.map(
    (fiskeriDirId) => vessels[fiskeriDirId],
  );

  const onChange = (vessels?: Vessel[]) => {
    setSelectedVessels(vessels ?? []);
  };
  return (
    <Box sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          width: "100%",
          height: "50vh",
          color: "black",
          boxShadow: "none",
          borderColor: "primary.dark",
          borderRadius: "5px",
          padding: "5px",
          margin: "5px",
          overflowY: "auto",
        }}
      >
        {followList && <FollowListItems vessels={followList} {...props} />}
      </Box>

      <Box
        sx={{
          "& .MuiIconButton-root": { color: "text.secondary" },
          margin: "5px",
        }}
      >
        <VesselFilter
          onChange={onChange}
          value={selectedVessels}
          useVirtualization={true}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "40vh",
          color: "black",
          boxShadow: "none",
          borderColor: "primary.dark",
          borderRadius: "5px",
          padding: "5px",
          paddingBottom: "20px",
          margin: "5px",
          overflowY: "auto",
        }}
      >
        {selectedVessels && selectedVessels.length > 0 && (
          <FollowListItems vessels={selectedVessels} {...props} />
        )}
      </Box>
    </Box>
  );
};
