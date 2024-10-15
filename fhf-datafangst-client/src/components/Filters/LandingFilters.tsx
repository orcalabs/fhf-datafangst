import { Box } from "@mui/material";
import { LandingsArgs, LandingsFilter } from "api";
import { LocalLoadingProgress } from "components/Common/LocalLoadingProgress";
import { Vessel } from "generated/openapi";
import { FC } from "react";
import {
  selectLandingGearFilterStats,
  selectLandingsMatrixLoading,
  selectLandingsMatrixSearch,
  selectLandingSpeciesFilterStats,
  selectLandingVesselLengthFilterStats,
  setHoveredLandingFilter,
  setLandingsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { MinLandingYear } from "utils";
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

  const setSearch = (update: Partial<LandingsArgs>) => {
    dispatch(setLandingsMatrixSearch({ ...landingsSearch, ...update }));
  };

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
              onChange={(value) => setSearch({ years: value })}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <MonthsFilter
              value={landingsSearch?.months}
              onChange={(value) => setSearch({ months: value })}
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
              onChange={(value) => setSearch({ gearGroupIds: value })}
              removeIfSingleEntry={removeSingleEntryFilters}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(LandingsFilter.SpeciesGroup)}>
            <SpeciesFilter
              value={landingsSearch?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) => setSearch({ speciesGroupIds: value })}
            />
          </Box>
          <Box onMouseEnter={() => onFilterHover(LandingsFilter.VesselLength)}>
            <LengthGroupFilter
              value={landingsSearch?.vesselLengthGroups}
              stats={lengthGroupStats}
              onChange={(value) => setSearch({ vesselLengthGroups: value })}
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
