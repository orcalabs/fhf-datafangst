import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import {
  Box,
  Divider,
  List,
  ListSubheader,
  TablePagination,
  Typography,
} from "@mui/material";
import { LandingsArgs, LandingsFilter, LandingsMatrixArgs } from "api";
import { LocalLoadingProgress, SortMenu, SortOption } from "components";
import { GearFilter } from "components/Filters/GearFilter";
import { LengthGroupFilter } from "components/Filters/LengthGroupFilter";
import { SpeciesFilter } from "components/Filters/SpeciesFilter";
import { Landing, LandingsSorting, Ordering } from "generated/openapi";
import { FC, useEffect } from "react";
import {
  getTrip,
  selectGearsMap,
  selectLandingGearFilterGridStats,
  selectLandings,
  selectLandingsLoading,
  selectLandingsMatrix2Loading,
  selectLandingsMatrix2Search,
  selectLandingsMatrixSearch,
  selectLandingSpeciesFilterGridStats,
  selectLandingsSearch,
  selectLandingVesselLengthFilterGridStats,
  selectSelectedGridsString,
  selectSelectedLanding,
  selectVesselsByLandingId,
  setLandingsMatrix2Search,
  setLandingsSearch,
  setSelectedLanding,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat, kilosOrTonsFormatter } from "utils";
import { ListItem } from "./ListItem";

export const LandingsMenu: FC = () => {
  const dispatch = useAppDispatch();

  const vessels = useAppSelector(selectVesselsByLandingId);
  const gears = useAppSelector(selectGearsMap);
  const landings = useAppSelector(selectLandings);
  const landingsLoading = useAppSelector(selectLandingsLoading);
  const selectedLanding = useAppSelector(selectSelectedLanding);
  const landingsSearch = useAppSelector(selectLandingsSearch);
  const matrixSearch = useAppSelector(selectLandingsMatrixSearch);
  const matrix2Search = useAppSelector(selectLandingsMatrix2Search);
  const matrixLoading = useAppSelector(selectLandingsMatrix2Loading);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const gearStats = useAppSelector(selectLandingGearFilterGridStats);
  const speciesStats = useAppSelector(selectLandingSpeciesFilterGridStats);
  const lengthGroupStats = useAppSelector(
    selectLandingVesselLengthFilterGridStats,
  );

  const selectedLandingId = selectedLanding?.id;

  const onSearchChange = (update: Partial<LandingsArgs>) => {
    dispatch(setLandingsSearch({ ...landingsSearch, ...update }));
  };

  const onMatrixSearchChange = (
    update: Partial<LandingsMatrixArgs>,
    filter: LandingsFilter,
  ) => {
    dispatch(setLandingsMatrix2Search({ ...matrix2Search, ...update, filter }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onSearchChange({ limit: +event.target.value, page: 0 });

  const handleLandingChange = (landing: Landing) => {
    const newLanding = landing.id === selectedLandingId ? undefined : landing;
    dispatch(setSelectedLanding(newLanding));
  };

  useEffect(() => {
    if (matrixSearch || matrix2Search) {
      onMatrixSearchChange(
        { ...matrixSearch, ...matrix2Search, catchLocations: selectedGrids },
        (matrixSearch ?? matrix2Search)?.filter ?? LandingsFilter.VesselLength,
      );
    }
  }, [selectedGrids]);

  return (
    <>
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Typography sx={{ py: 1 }} variant="h5" fontSize="1.3rem">
          VALGTE OMRÅDER
        </Typography>
        <Divider sx={{ bgcolor: "text.secondary", mt: 2, mb: 0 }} />
      </Box>
      {matrixLoading ? (
        <LocalLoadingProgress />
      ) : (
        <>
          <Box sx={{ px: 2.5, py: 1 }}>
            <GearFilter
              value={landingsSearch?.gearGroupIds}
              stats={gearStats}
              onChange={(value) =>
                onMatrixSearchChange(
                  { gearGroupIds: value },
                  LandingsFilter.GearGroup,
                )
              }
            />
            <SpeciesFilter
              value={landingsSearch?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) =>
                onMatrixSearchChange(
                  { speciesGroupIds: value },
                  LandingsFilter.SpeciesGroup,
                )
              }
            />
            <LengthGroupFilter
              value={landingsSearch?.vesselLengthGroups}
              stats={lengthGroupStats}
              onChange={(value) =>
                onMatrixSearchChange(
                  { vesselLengthGroups: value },
                  LandingsFilter.VesselLength,
                )
              }
            />
          </Box>
          <List sx={{ pt: 3 }}>
            <ListSubheader
              sx={{
                px: 0,
              }}
            >
              <TablePagination
                sx={{
                  bgcolor: "primary.light",
                  color: "white",
                  width: "100%",
                  "& .MuiTablePagination-toolbar": {
                    justifyContent: "space-evenly",
                    px: 2,
                  },
                  "& .MuiTablePagination-selectLabel": { m: 0 },
                  "& .MuiTablePagination-spacer": {
                    display: "none",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    flexShrink: 1,
                    m: 0,
                  },
                }}
                component="div"
                count={-1}
                page={landingsSearch.page ?? 0}
                onPageChange={(_, page: number) => onSearchChange({ page })}
                rowsPerPage={landingsSearch.limit ?? 10}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={
                  <SortMenu
                    value={[landingsSearch.sorting, landingsSearch.ordering]}
                    options={SORT_OPTIONS}
                    onChange={(sorting, ordering) =>
                      onSearchChange({ sorting, ordering })
                    }
                  />
                }
                labelDisplayedRows={({ from, to }) =>
                  `${from}–${from + Math.min(to - from, landings.length)}`
                }
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled:
                        landings.length !== (landingsSearch.limit ?? 10),
                    },
                  },
                }}
                padding="normal"
              />
            </ListSubheader>
            <Divider sx={{ bgcolor: "secondary.light", mt: 0, mb: 1, mx: 4 }} />
            {landingsLoading ? (
              <Box sx={{ pt: 2, pl: 2.5 }}>
                <LocalLoadingProgress />
              </Box>
            ) : !landings?.length ? (
              <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater</Box>
            ) : (
              <Box sx={{ pt: 1 }}>
                {landings?.map((l) => (
                  <ListItem
                    key={l.id}
                    selected={l.id === selectedLanding?.id}
                    title={
                      vessels[l.id]?.fiskeridir?.name ??
                      l.vesselName ??
                      "Ukjent"
                    }
                    subtitle={
                      kilosOrTonsFormatter(l.totalLivingWeight) +
                      " - " +
                      dateFormat(l.landingTimestamp, "PPP HH:mm")
                    }
                    expandedDetails={[
                      {
                        Icon: CalendarMonthSharpIcon,
                        text: dateFormat(l.landingTimestamp, "d. MMM HH:mm"),
                      },
                      { Icon: PhishingSharpIcon, text: gears[l.gearId].name },
                    ]}
                    catches={l.catches}
                    onSelect={() => handleLandingChange(l)}
                    onTripClick={
                      l.tripId
                        ? () => {
                            dispatch(getTrip({ tripId: l.tripId! }));
                          }
                        : undefined
                    }
                  />
                ))}
              </Box>
            )}
          </List>
        </>
      )}
    </>
  );
};

const SORT_OPTIONS: SortOption<LandingsSorting, Ordering>[] = [
  {
    label: "Dato nyest-eldst",
    value: [LandingsSorting.LandingTimestamp, Ordering.Desc],
  },
  {
    label: "Dato eldst-nyest",
    value: [LandingsSorting.LandingTimestamp, Ordering.Asc],
  },
  {
    label: "Vekt høy-lav",
    value: [LandingsSorting.LivingWeight, Ordering.Desc],
  },
  {
    label: "Vekt lav-høy",
    value: [LandingsSorting.LivingWeight, Ordering.Asc],
  },
];
