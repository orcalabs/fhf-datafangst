import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SortIcon from "@mui/icons-material/Sort";
import StraightenIcon from "@mui/icons-material/Straighten";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
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
import { HaulsFilter } from "api";
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
import { Haul, HaulsSorting, Ordering } from "generated/openapi";
import { FC, useEffect, useState } from "react";
import {
  getHaulTrip,
  selectGearsMap,
  selectHaulGearFilterGridStats,
  selectHaulsLoading,
  selectHaulsMatrix2Loading,
  selectHaulsMatrix2Search,
  selectHaulSpeciesFilterGridStats,
  selectHaulsSorted,
  selectHaulVesselLengthFilterGridStats,
  selectSecondaryMenuOpen,
  selectSelectedGrids,
  selectSelectedHaul,
  selectVesselsByHaulId,
  setHaulsMatrix2Search,
  setHoveredHaulFilter,
  setSelectedHaul,
  useAppDispatch,
  useAppSelector,
} from "store";
import {
  createHaulDurationString,
  dateFormat,
  distanceFormatter,
  kilosOrTonsFormatter,
  sumCatches,
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

export const HaulsMenu: FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectSecondaryMenuOpen);
  const vessels = useAppSelector(selectVesselsByHaulId);
  const gears = useAppSelector(selectGearsMap);
  const [sortOrder, setSortOrder] = useState<[HaulsSorting, Ordering]>([
    HaulsSorting.StartDate,
    Ordering.Desc,
  ]);
  const haulsMap = useAppSelector((state) =>
    selectHaulsSorted(state, sortOrder[0], sortOrder[1]),
  );
  const hauls = Object.values(haulsMap);
  const haulsLoading = useAppSelector(selectHaulsLoading);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const selectedGrids = useAppSelector(selectSelectedGrids);
  const haulsSearch = useAppSelector(selectHaulsMatrix2Search);
  const matrixLoading = useAppSelector(selectHaulsMatrix2Loading);
  const gearStats = useAppSelector(selectHaulGearFilterGridStats);
  const speciesStats = useAppSelector(selectHaulSpeciesFilterGridStats);
  const lengthGroupStats = useAppSelector(
    selectHaulVesselLengthFilterGridStats,
  );

  const selectedHaulId = selectedHaul?.haulId;
  const [sortButtonAnchorEl, setSortButtonAnchorEl] =
    useState<null | HTMLElement>(null);

  // Pagination state
  const [haulsPerPage, setHaulsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentHauls = hauls.slice(
    currentPage * haulsPerPage,
    currentPage * haulsPerPage + haulsPerPage,
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
    const newHaul = haul.haulId === selectedHaulId ? undefined : haul;
    dispatch(setSelectedHaul(newHaul));
  };

  const onFilterHover = (filter: HaulsFilter) =>
    dispatch(setHoveredHaulFilter(filter));

  // Change current page when Haul is selected from map click
  useEffect(() => {
    if (selectedHaul) {
      const selectedIndex = hauls.findIndex(
        (val) => val.haulId === selectedHaul?.haulId,
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

  const listItem = (
    haul: Haul,
    key: number,
    primary: string,
    secondary: string,
  ) => (
    <Accordion
      square
      disableGutters
      key={key}
      sx={accordionSx}
      expanded={haul.haulId === selectedHaulId}
      onChange={() => handleHaulChange(haul)}
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
        {haul.haulId === selectedHaulId && (
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
                dateFormat(haul.startTimestamp, "d. MMM HH:mm") +
                  " - " +
                  dateFormat(haul.stopTimestamp, "d. MMM HH:mm yyyy"),
              )}
              {item(TimerSharpIcon, createHaulDurationString(haul))}
              {item(StraightenIcon, distanceFormatter(haul.haulDistance ?? 0))}
              {item(PhishingSharpIcon, gears[haul.gearId].name)}
            </Box>
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                mt: 3,
              }}
            >
              Estimert fangst
            </Typography>
            <CatchesTable catches={haul.catches} />
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
                dispatch(getHaulTrip(haul));
              }}
              startIcon={<AllInclusiveSharpIcon sx={{ color: "white" }} />}
            >
              <Typography sx={{ pl: 1, color: "white" }}> Vis tur </Typography>
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const item = (Icon: any, text: string) => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SvgIcon sx={{ position: "relative", color: "white" }}>
        <Icon width={20} height={20} />
      </SvgIcon>
      <Typography sx={{ color: "white" }}>{text}</Typography>
    </Box>
  );

  const radioControl = (label: string, value: [HaulsSorting, Ordering]) => (
    <MenuItem>
      <FormControlLabel
        label={label}
        value={value.join(",")}
        control={<Radio />}
      />
    </MenuItem>
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
        <FormControl
          sx={{
            "& .MuiRadio-root": {
              "&:hover": { borderRadius: 0, bgcolor: "transparent" },
            },
          }}
        >
          <RadioGroup
            defaultValue="female"
            name="radio-sorting"
            value={sortOrder.join(",")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleSortChange(
                (event.target as HTMLInputElement).value.split(",") as [
                  HaulsSorting,
                  Ordering,
                ],
              )
            }
          >
            {radioControl("Dato nyest-eldst", [
              HaulsSorting.StartDate,
              Ordering.Desc,
            ])}
            {radioControl("Dato eldst-nyest", [
              HaulsSorting.StartDate,
              Ordering.Asc,
            ])}
            {radioControl("Vekt høy-lav", [HaulsSorting.Weight, Ordering.Desc])}
            {radioControl("Vekt lav-høy", [HaulsSorting.Weight, Ordering.Asc])}
          </RadioGroup>
        </FormControl>
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
          {haulsLoading || matrixLoading ? (
            <LocalLoadingProgress />
          ) : (
            <>
              <Box sx={{ px: 2.5, py: 1 }}>
                <Box onMouseEnter={() => onFilterHover(HaulsFilter.GearGroup)}>
                  <GearFilter
                    value={haulsSearch?.gearGroupIds}
                    stats={gearStats}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
                          gearGroupIds: value,
                        }),
                      )
                    }
                  />
                </Box>
                <Box
                  onMouseEnter={() => onFilterHover(HaulsFilter.SpeciesGroup)}
                >
                  <SpeciesFilter
                    value={haulsSearch?.speciesGroupIds}
                    stats={speciesStats}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
                          speciesGroupIds: value,
                        }),
                      )
                    }
                  />
                </Box>
                <Box
                  onMouseEnter={() => onFilterHover(HaulsFilter.VesselLength)}
                >
                  <LengthGroupFilter
                    value={haulsSearch?.vesselLengthGroups}
                    stats={lengthGroupStats}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
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
                    count={hauls.length}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={haulsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={sortButton}
                    padding="normal"
                  />
                </ListSubheader>
                <Divider
                  sx={{ bgcolor: "secondary.light", mt: 0, mb: 1, mx: 4 }}
                />
                {haulsLoading ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Laster...</Box>
                ) : !hauls?.length ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater</Box>
                ) : (
                  <Box sx={{ pt: 1 }}>
                    {currentHauls?.map((haul, index) =>
                      listItem(
                        haul,
                        index,
                        vessels[haul.haulId]?.fiskeridir?.name ??
                          haul.vesselNameErs?.toUpperCase() ??
                          "Ukjent",
                        kilosOrTonsFormatter(sumCatches(haul.catches)) +
                          " - " +
                          dateFormat(haul.startTimestamp, "PPP HH:mm"),
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
