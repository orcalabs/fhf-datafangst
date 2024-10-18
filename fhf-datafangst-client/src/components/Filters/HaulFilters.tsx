import { Box, Stack } from "@mui/material";
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
  setHoveredHaulFilter,
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
}

export const HaulFilters: FC<Props> = (props) => {
  const { selectedVessel, removeSingleEntryFilters } = props;

  const dispatch = useAppDispatch();
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const matrixLoading = useAppSelector(selectHaulsMatrixLoading);
  const gearStats = useAppSelector(selectHaulGearFilterStats);
  const speciesStats = useAppSelector(selectHaulSpeciesFilterStats);
  const lengthGroupStats = useAppSelector(selectHaulVesselLengthFilterStats);

  const onFilterHover = (filter: HaulsFilter) =>
    dispatch(setHoveredHaulFilter(filter));

  const setSearch = (update: Partial<HaulsArgs>) => {
    dispatch(setHaulsMatrixSearch({ ...haulsSearch, ...update }));
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        onMouseEnter={() => onFilterHover(HaulsFilter.Date)}
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
            onChange={(value) => setSearch({ years: value })}
          />
        </Box>
        <Box sx={{ width: "48%" }}>
          <MonthsFilter
            value={haulsSearch?.months}
            onChange={(value) => setSearch({ months: value })}
          />
        </Box>
      </Stack>
      {matrixLoading ? (
        <Box sx={{ py: 7, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : (
        <>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.GearGroup)}>
            <GearFilter
              value={haulsSearch?.gearGroupIds}
              stats={gearStats}
              onChange={(value) => setSearch({ gearGroupIds: value })}
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.SpeciesGroup)}>
            <SpeciesFilter
              value={haulsSearch?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) => setSearch({ speciesGroupIds: value })}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.VesselLength)}>
            <LengthGroupFilter
              value={haulsSearch?.vesselLengthGroups}
              stats={lengthGroupStats}
              onChange={(value) => setSearch({ vesselLengthGroups: value })}
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          {!selectedVessel && (
            <Box
              onMouseEnter={() => onFilterHover(HaulsFilter.Vessel)}
              sx={{ "& .MuiIconButton-root": { color: "text.secondary" } }}
            >
              <VesselFilter
                value={haulsSearch?.vessels}
                onChange={(value) => setSearch({ vessels: value })}
                useVirtualization
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};
