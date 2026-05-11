import { Box, Stack } from "@mui/material";
import type { FC } from "react";
import type { LandingsArgs } from "~/api";
import { LandingsFilter } from "~/api";
import { LocalLoadingProgress } from "~/components/Common/LocalLoadingProgress";
import type { Vessel } from "~/generated/openapi";
import {
  selectLandingGearFilterStats,
  selectLandingsMatrixLoading,
  selectLandingsMatrixSearch,
  selectLandingSpeciesFilterStats,
  selectLandingVesselLengthFilterStats,
  setLandingsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { MinLandingYear } from "~/utils";
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

  const setSearch = (update: Partial<LandingsArgs>, filter: LandingsFilter) => {
    dispatch(setLandingsMatrixSearch({ ...landingsSearch, ...update, filter }));
  };

  return (
    <>
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
            value={landingsSearch?.years}
            minYear={MinLandingYear}
            onChange={(value) =>
              setSearch({ years: value }, LandingsFilter.Date)
            }
          />
        </Box>
        <Box sx={{ width: "48%" }}>
          <MonthsFilter
            value={landingsSearch?.months}
            onChange={(value) =>
              setSearch({ months: value }, LandingsFilter.Date)
            }
          />
        </Box>
      </Stack>
      {matrixLoading ? (
        <Box sx={{ py: 7, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : (
        <>
          <GearFilter
            value={landingsSearch?.gearGroupIds}
            stats={gearStats}
            onChange={(value) =>
              setSearch({ gearGroupIds: value }, LandingsFilter.GearGroup)
            }
            removeIfSingleEntry={removeSingleEntryFilters}
          />
          <SpeciesFilter
            value={landingsSearch?.speciesGroupIds}
            stats={speciesStats}
            onChange={(value) =>
              setSearch({ speciesGroupIds: value }, LandingsFilter.SpeciesGroup)
            }
          />
          <LengthGroupFilter
            value={landingsSearch?.vesselLengthGroups}
            stats={lengthGroupStats}
            onChange={(value) =>
              setSearch(
                { vesselLengthGroups: value },
                LandingsFilter.VesselLength,
              )
            }
            removeIfSingleEntry={removeSingleEntryFilters}
          />
          {!selectedVessel && (
            <Box sx={{ "& .MuiIconButton-root": { color: "text.secondary" } }}>
              <VesselFilter
                value={landingsSearch?.vessels}
                onChange={(value) =>
                  setSearch(
                    { vessels: value },
                    landingsSearch?.filter ?? LandingsFilter.VesselLength,
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
