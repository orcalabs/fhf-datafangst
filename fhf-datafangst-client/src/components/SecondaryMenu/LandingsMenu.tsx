import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SortIcon from "@mui/icons-material/Sort";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  SvgIcon,
  TablePagination,
  Typography,
} from "@mui/material";
import { LandingsFilter } from "api";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import {
  CatchesTable,
  LocalLoadingProgress,
  SecondaryMenuWrapper,
} from "components";
import { GearFilter } from "components/Filters/GearFilter";
import { LengthGroupFilter } from "components/Filters/LengthGroupFilter";
import { SpeciesFilter } from "components/Filters/SpeciesFilter";
import { Landing, LandingsSorting, Ordering } from "generated/openapi";
import { FC, useEffect, useMemo, useState } from "react";
import {
  getLandingTrip,
  selectGearsMap,
  selectLandingGearFilterGridStats,
  selectLandingsLoading,
  selectLandingsMatrix2Loading,
  selectLandingsMatrix2Search,
  selectLandingSpeciesFilterGridStats,
  selectLandingsSorted,
  selectLandingVesselLengthFilterGridStats,
  selectSecondaryMenuOpen,
  selectSelectedGrids,
  selectSelectedLanding,
  selectVesselsByLandingId,
  setHoveredLandingFilter,
  setLandingsMatrix2Search,
  setSelectedLanding,
  useAppDispatch,
  useAppSelector,
} from "store";
import {
  dateFormat,
  kilosOrTonsFormatter,
  reduceCatchesOnSpecies,
} from "utils";

const accordionSx = {
  m: 0,
  py: 1,
  px: 2.5,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.light",
  "&.Mui-expanded": {
    m: 0,
    bgcolor: "primary.dark",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "& .MuiAccordionSummary-root": { p: 0 },
  "& .MuiAccordionSummary-content": { m: 0 },

  "&:hover": { bgcolor: "primary.dark" },
  "&:before": { display: "none" },
};

export const LandingsMenu: FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectSecondaryMenuOpen);
  const vessels = useAppSelector(selectVesselsByLandingId);
  const gears = useAppSelector(selectGearsMap);
  const [sortOrder, setSortOrder] = useState<[LandingsSorting, Ordering]>([
    LandingsSorting.LandingTimestamp,
    Ordering.Desc,
  ]);
  // Memoize selector so we dont perform sorting on landings each time component re-renders.
  const selector = useMemo(
    () => selectLandingsSorted(sortOrder[0], sortOrder[1]),
    [sortOrder],
  );
  const landingsMap = useAppSelector(selector);
  const landings = Object.values(landingsMap);
  const landingsLoading = useAppSelector(selectLandingsLoading);
  const selectedLanding = useAppSelector(selectSelectedLanding);
  const selectedGrids = useAppSelector(selectSelectedGrids);
  const landingsSearch = useAppSelector(selectLandingsMatrix2Search);
  const matrixLoading = useAppSelector(selectLandingsMatrix2Loading);
  const gearStats = useAppSelector(selectLandingGearFilterGridStats);
  const speciesStats = useAppSelector(selectLandingSpeciesFilterGridStats);
  const lengthGroupStats = useAppSelector(
    selectLandingVesselLengthFilterGridStats,
  );

  const selectedLandingId = selectedLanding?.landingId;
  const [sortButtonAnchorEl, setSortButtonAnchorEl] =
    useState<null | HTMLElement>(null);

  // Pagination state
  const [landingsPerPage, setLandingsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentLandings = landings.slice(
    currentPage * landingsPerPage,
    currentPage * landingsPerPage + landingsPerPage,
  );

  const handleSortChange = (sortOrdering: [LandingsSorting, Ordering]) => {
    setSortOrder(sortOrdering);
    dispatch(setSelectedLanding(undefined));
    setCurrentPage(0);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setSelectedLanding(undefined));
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLandingsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleLandingChange = (landing: Landing) => {
    const newLanding =
      landing.landingId === selectedLandingId ? undefined : landing;
    dispatch(setSelectedLanding(newLanding));
  };

  const onFilterHover = (filter: LandingsFilter) =>
    dispatch(setHoveredLandingFilter(filter));

  // Change current page when Landing is selected from map click
  useEffect(() => {
    if (selectedLanding) {
      const selectedIndex = landings.findIndex(
        (val) => val.landingId === selectedLanding?.landingId,
      );

      if (selectedIndex !== -1) {
        setCurrentPage(Math.floor(selectedIndex / landingsPerPage));
      }
    }
  }, [selectedLanding]);

  // Reset pagination on new grid selection
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedGrids]);

  const listItem = (
    landing: Landing,
    key: number,
    primary: string,
    secondary: string,
  ) => {
    const deliveryCatchesMap = reduceCatchesOnSpecies(landing.catches);
    const landingCatches = Object.values(deliveryCatchesMap);
    return (
      <Accordion
        square
        disableGutters
        key={key}
        sx={accordionSx}
        expanded={landing.landingId === selectedLandingId}
        onChange={() => handleLandingChange(landing)}
      >
        <AccordionSummary>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 2 },
            }}
          >
            <FishIcon
              width="48"
              height="48"
              fill={`${theme.palette.secondary.light}`}
            />
          </Box>
          <ListItemText primary={primary} secondary={secondary} />
        </AccordionSummary>
        <AccordionDetails sx={{ pb: 0 }}>
          {landing.landingId === selectedLandingId && (
            <Box sx={{ py: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  "& svg": { mr: 2 },
                }}
              >
                {item(
                  CalendarMonthSharpIcon,
                  dateFormat(landing.landingTimestamp, "d. MMM HH:mm"),
                )}
                {item(PhishingSharpIcon, gears[landing.gearId].name)}
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  mt: 3,
                }}
              >
                Levert fangst
              </Typography>
              <CatchesTable catches={landingCatches} />
              <Button
                size="small"
                sx={{
                  width: "100%",
                  bgcolor: "secondary.main",
                  px: 2,
                  borderRadius: 0,
                  mt: 1,
                }}
                onClick={() => {
                  dispatch(getLandingTrip(landing));
                }}
                startIcon={<AllInclusiveSharpIcon sx={{ color: "white" }} />}
              >
                <Typography sx={{ pl: 1, color: "white" }}>Vis tur</Typography>
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const item = (Icon: any, text: string) => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SvgIcon sx={{ position: "relative", color: "white" }}>
        <Icon width={20} height={20} />
      </SvgIcon>
      <Typography sx={{ color: "white" }}>{text}</Typography>
    </Box>
  );

  const radioControl = (label: string, value: [LandingsSorting, Ordering]) => (
    <FormControlLabel label={label} value={value} control={<Radio />} />
  );

  const sortButton = (
    <>
      <span>
        <IconButton
          sx={{ mr: 3, py: 0 }}
          size="small"
          onClick={(event) => {
            setSortButtonAnchorEl(event.currentTarget);
          }}
        >
          <SortIcon sx={{ color: "white" }} />
        </IconButton>
      </span>

      <Menu
        anchorEl={sortButtonAnchorEl}
        open={Boolean(sortButtonAnchorEl)}
        onClose={() => {
          setSortButtonAnchorEl(null);
        }}
        onClick={() => setSortButtonAnchorEl(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem>
          <FormControl
            sx={{
              "& .MuiButtonBase-root": {
                "&:hover": { borderRadius: 0 },
              },
            }}
          >
            <RadioGroup
              defaultValue="female"
              name="radio-sorting"
              value={sortOrder.join(" ")}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSortChange(
                  (event.target as HTMLInputElement).value.split(",") as [
                    LandingsSorting,
                    Ordering,
                  ],
                )
              }
            >
              {radioControl("Dato nyest-eldst", [
                LandingsSorting.LandingTimestamp,
                Ordering.Desc,
              ])}
              {radioControl("Dato eldst-nyest", [
                LandingsSorting.LandingTimestamp,
                Ordering.Asc,
              ])}
              {radioControl("Vekt høy-lav", [
                LandingsSorting.LivingWeight,
                Ordering.Desc,
              ])}
              {radioControl("Vekt lav-høy", [
                LandingsSorting.LivingWeight,
                Ordering.Asc,
              ])}
            </RadioGroup>
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <>
      {open && (
        <SecondaryMenuWrapper>
          <Box sx={{ px: 2.5, pt: 2.5 }}>
            <Typography sx={{ py: 1 }} variant="h5" fontSize="1.3rem">
              VALGTE OMRÅDER
            </Typography>
            <Divider sx={{ bgcolor: "text.secondary", mt: 2, mb: 0 }} />
          </Box>
          {landingsLoading || matrixLoading ? (
            <LocalLoadingProgress />
          ) : (
            <>
              <Box sx={{ px: 2.5, py: 1 }}>
                <Box
                  onMouseEnter={() => onFilterHover(LandingsFilter.GearGroup)}
                >
                  <GearFilter
                    value={landingsSearch?.gearGroupIds}
                    stats={gearStats}
                    onChange={(value) =>
                      dispatch(
                        setLandingsMatrix2Search({
                          ...landingsSearch,
                          gearGroupIds: value,
                        }),
                      )
                    }
                  />
                </Box>
                <Box
                  onMouseEnter={() =>
                    onFilterHover(LandingsFilter.SpeciesGroup)
                  }
                >
                  <SpeciesFilter
                    value={landingsSearch?.speciesGroupIds}
                    stats={speciesStats}
                    onChange={(value) =>
                      dispatch(
                        setLandingsMatrix2Search({
                          ...landingsSearch,
                          speciesGroupIds: value,
                        }),
                      )
                    }
                  />
                </Box>
                <Box
                  onMouseEnter={() =>
                    onFilterHover(LandingsFilter.VesselLength)
                  }
                >
                  <LengthGroupFilter
                    value={landingsSearch?.vesselLengthGroups}
                    stats={lengthGroupStats}
                    onChange={(value) =>
                      dispatch(
                        setLandingsMatrix2Search({
                          ...landingsSearch,
                          vesselLengthGroups: value,
                        }),
                      )
                    }
                  />
                </Box>
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
                    count={landings.length}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={landingsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={sortButton}
                    padding="normal"
                  />
                </ListSubheader>
                <Divider
                  sx={{ bgcolor: "secondary.light", mt: 0, mb: 1, mx: 4 }}
                />
                {landingsLoading ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Laster...</Box>
                ) : !landings?.length ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater</Box>
                ) : (
                  <Box sx={{ pt: 1 }}>
                    {currentLandings?.map((landing, index) =>
                      listItem(
                        landing,
                        index,
                        vessels[landing.landingId]?.fiskeridir?.name ??
                          landing.vesselName ??
                          "Ukjent",
                        kilosOrTonsFormatter(landing.totalLivingWeight) +
                          " - " +
                          dateFormat(landing.landingTimestamp, "PPP HH:mm"),
                      ),
                    )}
                  </Box>
                )}
              </List>
            </>
          )}
        </SecondaryMenuWrapper>
      )}
    </>
  );
};
