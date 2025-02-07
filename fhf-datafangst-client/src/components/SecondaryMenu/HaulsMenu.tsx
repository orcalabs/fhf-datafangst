import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import StraightenIcon from "@mui/icons-material/Straighten";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Box,
  Divider,
  List,
  ListSubheader,
  TablePagination,
  Typography,
} from "@mui/material";
import { HaulsArgs, HaulsFilter } from "api";
import { LocalLoadingProgress, SortMenu, SortOption } from "components";
import { GearFilter } from "components/Filters/GearFilter";
import { LengthGroupFilter } from "components/Filters/LengthGroupFilter";
import { SpeciesFilter } from "components/Filters/SpeciesFilter";
import { Haul, HaulsSorting, Ordering } from "generated/openapi";
import { FC, useEffect, useMemo, useState } from "react";
import {
  getTrip,
  selectGearsMap,
  selectHaulGearFilterGridStats,
  selectHaulsLoading,
  selectHaulsMatrix2Loading,
  selectHaulsMatrix2Search,
  selectHaulsMatrixSearch,
  selectHaulSpeciesFilterGridStats,
  selectHaulsSorted,
  selectHaulVesselLengthFilterGridStats,
  selectSelectedGridsString,
  selectSelectedHaul,
  selectVesselsByHaulId,
  setHaulsMatrix2Search,
  setSelectedHaul,
  useAppDispatch,
  useAppSelector,
} from "store";
import {
  createHaulDurationString,
  dateFormat,
  distanceFormatter,
  kilosOrTonsFormatter,
  reduceCatchesOnSpecies,
  sumCatches,
} from "utils";
import { ListItem } from "./ListItem";

export const HaulsMenu: FC = () => {
  const dispatch = useAppDispatch();

  const vessels = useAppSelector(selectVesselsByHaulId);
  const gears = useAppSelector(selectGearsMap);
  const [sortOrder, setSortOrder] = useState<[HaulsSorting, Ordering]>([
    HaulsSorting.StartDate,
    Ordering.Desc,
  ]);
  const hauls = useAppSelector((state) =>
    selectHaulsSorted(state, sortOrder[0], sortOrder[1]),
  );
  const haulsLoading = useAppSelector(selectHaulsLoading);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const matrixSearch = useAppSelector(selectHaulsMatrixSearch);
  const matrix2Search = useAppSelector(selectHaulsMatrix2Search);
  const matrixLoading = useAppSelector(selectHaulsMatrix2Loading);
  const gearStats = useAppSelector(selectHaulGearFilterGridStats);
  const speciesStats = useAppSelector(selectHaulSpeciesFilterGridStats);
  const lengthGroupStats = useAppSelector(
    selectHaulVesselLengthFilterGridStats,
  );

  const selectedHaulId = selectedHaul?.id;

  // Pagination state
  const [haulsPerPage, setHaulsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const currentHauls = useMemo(
    () =>
      hauls.slice(
        currentPage * haulsPerPage,
        currentPage * haulsPerPage + haulsPerPage,
      ),
    [hauls, currentPage, haulsPerPage],
  );

  const handleSortChange = (sortOrdering: [HaulsSorting, Ordering]) => {
    setSortOrder(sortOrdering);
    dispatch(setSelectedHaul(undefined));
    setCurrentPage(0);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setSelectedHaul(undefined));
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setHaulsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleHaulChange = (haul: Haul) => {
    const newHaul = haul.id === selectedHaulId ? undefined : haul;
    dispatch(setSelectedHaul(newHaul));
  };

  const onSearchChange = (update: Partial<HaulsArgs>, filter: HaulsFilter) => {
    dispatch(setHaulsMatrix2Search({ ...matrix2Search, ...update, filter }));
  };

  useEffect(() => {
    if (matrixSearch || matrix2Search) {
      onSearchChange(
        { ...matrixSearch, ...matrix2Search, catchLocations: selectedGrids },
        (matrixSearch ?? matrix2Search)?.filter ?? HaulsFilter.VesselLength,
      );
    }
  }, [selectedGrids]);

  // Change current page when Haul is selected from map click
  useEffect(() => {
    if (selectedHaul) {
      const selectedIndex = hauls.findIndex(
        (val) => val.id === selectedHaul?.id,
      );

      if (selectedIndex !== -1) {
        setCurrentPage(Math.floor(selectedIndex / haulsPerPage));
      }
    }
  }, [selectedHaul]);

  // Reset pagination on new grid selection
  useEffect(() => {
    setCurrentPage(0);
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
        <Box sx={{ pt: 2, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2.5, py: 1 }}>
            <GearFilter
              value={matrix2Search?.gearGroupIds}
              stats={gearStats}
              onChange={(value) =>
                onSearchChange({ gearGroupIds: value }, HaulsFilter.GearGroup)
              }
            />
            <SpeciesFilter
              value={matrix2Search?.speciesGroupIds}
              stats={speciesStats}
              onChange={(value) =>
                onSearchChange(
                  { speciesGroupIds: value },
                  HaulsFilter.SpeciesGroup,
                )
              }
            />
            <LengthGroupFilter
              value={matrix2Search?.vesselLengthGroups}
              stats={lengthGroupStats}
              onChange={(value) =>
                onSearchChange(
                  { vesselLengthGroups: value },
                  HaulsFilter.VesselLength,
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
                count={hauls.length}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={haulsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={
                  <SortMenu
                    value={sortOrder}
                    options={SORT_OPTIONS}
                    onChange={(sorting, ordering) =>
                      handleSortChange([sorting, ordering])
                    }
                  />
                }
                padding="normal"
              />
            </ListSubheader>
            <Divider sx={{ bgcolor: "secondary.light", mt: 0, mb: 1, mx: 4 }} />
            {haulsLoading ? (
              <Box sx={{ pt: 2, pl: 2.5 }}>
                <LocalLoadingProgress />
              </Box>
            ) : !hauls?.length ? (
              <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater</Box>
            ) : (
              <Box sx={{ pt: 1 }}>
                {currentHauls?.map((h) => (
                  <ListItem
                    key={h.id}
                    selected={h.id === selectedHaul?.id}
                    title={
                      vessels[h.id]?.fiskeridir?.name ??
                      h.vesselName?.toUpperCase() ??
                      "Ukjent"
                    }
                    subtitle={
                      kilosOrTonsFormatter(sumCatches(h.catches)) +
                      " - " +
                      dateFormat(h.startTimestamp, "PPP HH:mm")
                    }
                    expandedDetails={[
                      {
                        Icon: CalendarMonthSharpIcon,
                        text:
                          dateFormat(h.startTimestamp, "d. MMM HH:mm") +
                          " - " +
                          dateFormat(h.stopTimestamp, "d. MMM HH:mm yyyy"),
                      },
                      {
                        Icon: TimerSharpIcon,
                        text: createHaulDurationString(h),
                      },
                      {
                        Icon: StraightenIcon,
                        text: distanceFormatter(h.haulDistance ?? 0),
                      },
                      { Icon: PhishingSharpIcon, text: gears[h.gear].name },
                    ]}
                    catches={Object.values(reduceCatchesOnSpecies(h.catches))}
                    onSelect={() => handleHaulChange(h)}
                    onTripClick={
                      h.tripId
                        ? () => {
                            dispatch(getTrip({ tripId: h.tripId! }));
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

const SORT_OPTIONS: SortOption<HaulsSorting, Ordering>[] = [
  {
    label: "Dato nyest-eldst",
    value: [HaulsSorting.StartDate, Ordering.Desc],
  },
  {
    label: "Dato eldst-nyest",
    value: [HaulsSorting.StartDate, Ordering.Asc],
  },
  {
    label: "Vekt høy-lav",
    value: [HaulsSorting.Weight, Ordering.Desc],
  },
  {
    label: "Vekt lav-høy",
    value: [HaulsSorting.Weight, Ordering.Asc],
  },
];
