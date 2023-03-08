import { Box, Drawer } from "@mui/material";
import { FC } from "react";
import {
  selectHaulsFilter,
  selectHaulsSearch,
  setHaulsFilter,
  setHaulsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { GearFilter } from "./GearFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpecieFilter } from "./SpecieFilter";
import { VesselFilter } from "./VesselFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { YearsFilter } from "./YearsFilter";

export const FilterMenu: FC = () => {
  const haulsSearch = useAppSelector(selectHaulsSearch);
  const haulsFilter = useAppSelector(selectHaulsFilter);
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
        <Box
          sx={{
            width: "100%",
            "& .MuiChip-filled": {
              color: "black",
              bgcolor: "secondary.main",
              borderRadius: 0,
            },
            "& .MuiButtonBase-root": {
              borderRadius: 0,

              "&:hover": {
                borderRadius: 0,
              },
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "100%" }}>
              <YearsFilter
                value={haulsSearch?.years}
                onChange={(value) =>
                  dispatch(setHaulsSearch({ ...haulsSearch, years: value }))
                }
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <MonthsFilter
                value={haulsSearch?.months}
                onChange={(value) =>
                  dispatch(setHaulsSearch({ ...haulsSearch, months: value }))
                }
              />
            </Box>
          </Box>
        </Box>
        <VesselFilter
          value={haulsFilter?.vessel}
          onChange={(value) =>
            dispatch(setHaulsFilter({ ...haulsFilter, vessel: value }))
          }
          useVirtualization
        />
        <GearFilter
          value={haulsFilter?.gearGroups}
          onChange={(value) =>
            dispatch(setHaulsFilter({ ...haulsFilter, gearGroups: value }))
          }
        />
        <SpecieFilter
          value={haulsFilter?.speciesGroups}
          onChange={(value) =>
            dispatch(setHaulsFilter({ ...haulsFilter, speciesGroups: value }))
          }
        />
        <LengthGroupFilter
          value={haulsFilter?.lengthGroups}
          onChange={(value) =>
            dispatch(setHaulsFilter({ ...haulsFilter, lengthGroups: value }))
          }
        />
      </Drawer>
    </Box>
  );
};
