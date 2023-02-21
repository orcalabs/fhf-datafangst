import { Box, Drawer } from "@mui/material";
import { FC } from "react";
import {
  selectHaulsSearch,
  setHaulsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { GearFilter } from "./GearFilter";
import { SpecieFilter } from "./SpecieFilter";
import { VesselFilter } from "./VesselFilter";
import { VesselLengthFilter } from "./VesselLengthFilter";
import { WeightFilter } from "./WeightFilter";

export const FilterMenu: FC = () => {
  const haulsSearch = useAppSelector(selectHaulsSearch);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            p: 3,
            width: 500,
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
        }}
      >
        <VesselFilter
          value={haulsSearch?.vessel}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, ...value }))
          }
        />
        <GearFilter
          value={haulsSearch?.gearGroups}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, ...value }))
          }
        />
        <SpecieFilter
          value={haulsSearch?.speciesGroups}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, ...value }))
          }
        />
        <VesselLengthFilter
          value={haulsSearch?.vesselLength}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, ...value }))
          }
        />
        <WeightFilter
          value={haulsSearch?.weight}
          onChange={(value) =>
            dispatch(setHaulsSearch({ ...haulsSearch, ...value }))
          }
        />
      </Drawer>
    </Box>
  );
};
