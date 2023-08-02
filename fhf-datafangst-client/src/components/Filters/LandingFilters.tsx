import { Box } from "@mui/material";
import { FC } from "react";
import {
  selectLandingsMatrixSearch,
  setHoveredLandingFilter,
  setLandingsMatrixSearch,
  useAppDispatch,
  useAppSelector,
  selectLandingsMatrixLoading,
  selectLandingGearFilterStats,
  selectLandingSpeciesFilterStats,
  selectLandingVesselLengthFilterStats,
} from "store";
import { GearFilter } from "./GearFilter";
import { MonthsFilter } from "./MonthsFilter";
import { SpeciesFilter } from "./SpeciesFilter";
import { LengthGroupFilter } from "./LengthGroupFilter";
import { YearsFilter } from "./YearsFilter";
import { VesselFilter } from "./VesselFilter";
import { LandingsFilter } from "api";
import { Vessel } from "generated/openapi";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import { MinLandingYear } from "utils";

interface Props {
  selectedVessel?: Vessel;
  removeSingleEntryFilters?: boolean;
}

export const LandingFilters: FC<Props> = (props) => {
  const { selectedVessel, removeSingleEntryFilters } = props;

  const dispatch = useAppDispatch();
  const landingsSearch = useAppSelector(selectLandingsMatrixSearch);
  const matrixLoading = useAppSelector(selectLandingsMatrixLoading);
  const gearStats = useAppSelector(selectLandingGearFilterStats);
  const speciesStats = useAppSelector(selectLandingSpeciesFilterStats);
  const lengthGroupStats = useAppSelector(selectLandingVesselLengthFilterStats);

  const onFilterHover = (filter: LandingsFilter) =>
    dispatch(setHoveredLandingFilter(filter));

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
          onMouseEnter={() => onFilterHover(LandingsFilter.Date)}
        >
          <Box sx={{ width: "100%" }}>
            <YearsFilter
              value={landingsSearch?.years}
              minYear={MinLandingYear}
              onChange={(value) =>
                dispatch(
                  setLandingsMatrixSearch({ ...landingsSearch, years: value }),
                )
              }
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <MonthsFilter
              value={landingsSearch?.months}
              onChange={(value) =>
                dispatch(
                  setLandingsMatrixSearch({ ...landingsSearch, months: value }),
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
          <Box onMouseEnter={() => onFilterHover(LandingsFilter.GearGroup)}>
            <GearFilter
              value={landingsSearch?.gearGroupIds}
              stats={gearStats}
              onChange={(value) =>
                dispatch(
                  setLandingsMatrixSearch({
                    ...landingsSearch,
                    gearGroupIds: value,
                  }),
                )
              }
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(LandingsFilter.SpeciesGroup)}>
            <SpeciesFilter
              value={landingsSearch?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) =>
                dispatch(
                  setLandingsMatrixSearch({
                    ...landingsSearch,
                    speciesGroupIds: value,
                  }),
                )
              }
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(LandingsFilter.VesselLength)}>
            <LengthGroupFilter
              value={landingsSearch?.vesselLengthRanges}
              stats={lengthGroupStats}
              onChange={(value) =>
                dispatch(
                  setLandingsMatrixSearch({
                    ...landingsSearch,
                    vesselLengthRanges: value,
                  }),
                )
              }
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          {!selectedVessel && (
            <Box
              onMouseEnter={() => onFilterHover(LandingsFilter.Vessel)}
              sx={{ "& .MuiIconButton-root": { color: "text.secondary" } }}
            >
              <VesselFilter
                value={landingsSearch?.vessels}
                onChange={(value) =>
                  dispatch(
                    setLandingsMatrixSearch({
                      ...landingsSearch,
                      vessels: value,
                    }),
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
