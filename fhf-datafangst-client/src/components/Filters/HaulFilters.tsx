import { Box } from "@mui/material";
import { FC } from "react";
import {
  selectHaulsMatrixSearch,
  setHoveredHaulFilter,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
  selectHaulsMatrixLoading,
  selectHaulGearFilterStats,
  selectHaulSpeciesFilterStats,
  selectHaulVesselLengthFilterStats,
} from "store";
import { GearFilter } from "./GearFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpeciesFilter } from "./SpeciesFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { YearsFilter } from "./YearsFilter";
import { VesselFilter } from "./VesselFilter";
import { HaulsFilter } from "api";
import { Vessel } from "generated/openapi";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import { MinErsYear } from "utils";

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

  return (
    <>
      <Box
        sx={{
          width: "100%",
          "& .MuiButtonBase-root": {
            borderRadius: 0,
            "&:hover": {
              borderRadius: 0,
            },
          },
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between" }}
          onMouseEnter={() => onFilterHover(HaulsFilter.Date)}
        >
          <Box sx={{ width: "100%" }}>
            <YearsFilter
              value={haulsSearch?.years}
              minYear={MinErsYear}
              onChange={(value) =>
                dispatch(setHaulsMatrixSearch({ ...haulsSearch, years: value }))
              }
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <MonthsFilter
              value={haulsSearch?.months}
              onChange={(value) =>
                dispatch(
                  setHaulsMatrixSearch({ ...haulsSearch, months: value }),
                )
              }
            />
          </Box>
        </Box>
      </Box>
      {matrixLoading ? (
        <Box sx={{ height: "50%", py: 5, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : (
        <>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.GearGroup)}>
            <GearFilter
              value={haulsSearch?.gearGroupIds}
              stats={gearStats}
              onChange={(value) =>
                dispatch(
                  setHaulsMatrixSearch({ ...haulsSearch, gearGroupIds: value }),
                )
              }
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.SpeciesGroup)}>
            <SpeciesFilter
              value={haulsSearch?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) =>
                dispatch(
                  setHaulsMatrixSearch({
                    ...haulsSearch,
                    speciesGroupIds: value,
                  }),
                )
              }
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(HaulsFilter.VesselLength)}>
            <LengthGroupFilter
              value={haulsSearch?.vesselLengthGroups}
              stats={lengthGroupStats}
              onChange={(value) =>
                dispatch(
                  setHaulsMatrixSearch({
                    ...haulsSearch,
                    vesselLengthGroups: value,
                  }),
                )
              }
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
                onChange={(value) =>
                  dispatch(
                    setHaulsMatrixSearch({ ...haulsSearch, vessels: value }),
                  )
                }
                useVirtualization
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};
