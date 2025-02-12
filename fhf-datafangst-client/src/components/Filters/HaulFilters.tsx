import { Box, Stack, SxProps } from "@mui/material";
import { HaulsArgs, HaulsFilter } from "api";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import { Vessel } from "generated/openapi";
import { FC } from "react";
import {
  selectHaulGearFilterStats,
  selectHaulsMatrixLoading,
  selectHaulsMatrixSearch,
  selectHaulSpeciesFilterStats,
  selectHaulVesselLengthFilterStats,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { MinErsYear } from "utils";
import { GearFilter } from "./GearFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpeciesFilter } from "./SpeciesFilter";
import { VesselFilter } from "./VesselFilter";
import { YearsFilter } from "./YearsFilter";

interface Props {
  selectedVessel?: Vessel;
  removeSingleEntryFilters?: boolean;
  sx?: SxProps;
}

export const HaulFilters: FC<Props> = ({
  selectedVessel,
  removeSingleEntryFilters,
  sx,
}) => {
  const dispatch = useAppDispatch();
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const matrixLoading = useAppSelector(selectHaulsMatrixLoading);
  const gearStats = useAppSelector(selectHaulGearFilterStats);
  const speciesStats = useAppSelector(selectHaulSpeciesFilterStats);
  const lengthGroupStats = useAppSelector(selectHaulVesselLengthFilterStats);

  const setSearch = (update: Partial<HaulsArgs>, filter: HaulsFilter) => {
    dispatch(setHaulsMatrixSearch({ ...haulsSearch, ...update, filter }));
  };

  if (matrixLoading) {
    return (
      <Box sx={{ ...sx, py: 7, pl: 2.5 }}>
        <LocalLoadingProgress />
      </Box>
    );
  }

  return (
    <Stack sx={sx}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          "& .MuiButtonBase-root": {
            borderRadius: 0,
            "&:hover": {
              borderRadius: 0,
            },
          },
        }}
      >
        <Box sx={{ width: "48%" }}>
          <YearsFilter
            value={haulsSearch?.years}
            minYear={MinErsYear}
            onChange={(value) => setSearch({ years: value }, HaulsFilter.Date)}
          />
        </Box>
        <Box sx={{ width: "48%" }}>
          <MonthsFilter
            value={haulsSearch?.months}
            onChange={(value) => setSearch({ months: value }, HaulsFilter.Date)}
          />
        </Box>
      </Stack>
      <GearFilter
        value={haulsSearch?.gearGroupIds}
        stats={gearStats}
        onChange={(value) =>
          setSearch({ gearGroupIds: value }, HaulsFilter.GearGroup)
        }
        removeIfSingleEntry={removeSingleEntryFilters}
      />
      <SpeciesFilter
        value={haulsSearch?.speciesGroupIds}
        stats={speciesStats}
        onChange={(value) =>
          setSearch({ speciesGroupIds: value }, HaulsFilter.SpeciesGroup)
        }
      />
      <LengthGroupFilter
        value={haulsSearch?.vesselLengthGroups}
        stats={lengthGroupStats}
        onChange={(value) =>
          setSearch({ vesselLengthGroups: value }, HaulsFilter.VesselLength)
        }
        removeIfSingleEntry={removeSingleEntryFilters}
      />
      {!selectedVessel && (
        <Box sx={{ "& .MuiIconButton-root": { color: "text.secondary" } }}>
          <VesselFilter
            value={haulsSearch?.vessels}
            onChange={(value) =>
              setSearch(
                { vessels: value },
                haulsSearch?.filter ?? HaulsFilter.VesselLength,
              )
            }
            useVirtualization
          />
        </Box>
      )}
    </Stack>
  );
};
