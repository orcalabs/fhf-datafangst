import { FC, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItemText,
  Typography,
  SvgIcon,
  ListSubheader,
  Drawer,
  TablePagination,
  Button,
  Divider,
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";
import {
  createHaulDurationString,
  dateFormat,
  distanceFormatter,
  kilosOrTonsFormatter,
  sumCatches,
} from "utils";
import { CatchesTable } from "components";
import {
  getHaulTrip,
  selectGearsMap,
  selectHaulsLoading,
  selectHaulsMenuOpen,
  selectHaulsSorted,
  selectSelectedGrids,
  selectSelectedHaul,
  selectVesselsByHaulId,
  setSelectedHaul,
  useAppDispatch,
  useAppSelector,
  setHaulsMatrix2Search,
  selectHaulsMatrix2Search,
  selectGearFilterGridStatsSorted,
  selectVesselLengthFilterGridStatsSorted,
  selectSpeciesFilterGridStatsSorted,
  setHoveredFilter,
} from "store";
import { Haul } from "generated/openapi";
import { FishIcon } from "assets/icons";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import { GearFilter } from "components/FilterMenu/GearFilter";
import { LengthGroupFilter } from "components/FilterMenu/LengthGroupFilter";
import { SpeciesFilter } from "components/FilterMenu/SpeciesFilter";
import { HaulsFilter } from "api";
import theme from "app/theme";

const accordionSx = {
  m: 0,
  py: 1,
  px: 2.5,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.main",
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
  const open = useAppSelector(selectHaulsMenuOpen);
  const vessels = useAppSelector(selectVesselsByHaulId);
  const gears = useAppSelector(selectGearsMap);
  const hauls = useAppSelector(selectHaulsSorted);
  const haulsLoading = useAppSelector(selectHaulsLoading);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const selectedGrids = useAppSelector(selectSelectedGrids);
  const haulsSearch = useAppSelector(selectHaulsMatrix2Search);
  const selectedHaulId = selectedHaul?.haulId;

  // Pagination state
  const [haulsPerPage, setHaulsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentHauls = hauls.slice(
    currentPage * haulsPerPage,
    currentPage * haulsPerPage + haulsPerPage,
  );

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
    dispatch(setHoveredFilter(filter));

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
                dateFormat(haul.startTimestamp, "PPP HH:mm"),
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
                dispatch(getHaulTrip({ haul }));
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

  return (
    <>
      {open && (
        <Box sx={{ height: "100%" }}>
          <Drawer
            sx={{
              height: "100%",
              "& .MuiDrawer-paper": {
                flexShrink: 0,
                boxSizing: "border-box",
                height: "100%",
                position: "relative",
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
            open
            variant="persistent"
            anchor="right"
          >
            <Box sx={{ flexGrow: 1, overflowY: "auto", height: "90%" }}>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ py: 1 }} variant="h5" fontSize="1.3rem">
                  VALGTE OMRÅDER
                </Typography>
                <Divider sx={{ bgcolor: "text.secondary", mt: 3, mb: 1 }} />
                <Box onMouseEnter={() => onFilterHover(HaulsFilter.GearGroup)}>
                  <GearFilter
                    value={haulsSearch?.gearGroupIds}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
                          gearGroupIds: value,
                        }),
                      )
                    }
                    statsSelector={selectGearFilterGridStatsSorted}
                  />
                </Box>
                <Box
                  onMouseEnter={() => onFilterHover(HaulsFilter.SpeciesGroup)}
                >
                  <SpeciesFilter
                    value={haulsSearch?.speciesGroupIds}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
                          speciesGroupIds: value,
                        }),
                      )
                    }
                    statsSelector={selectSpeciesFilterGridStatsSorted}
                  />
                </Box>
                <Box
                  onMouseEnter={() => onFilterHover(HaulsFilter.VesselLength)}
                >
                  <LengthGroupFilter
                    value={haulsSearch?.vesselLengthRanges}
                    onChange={(value) =>
                      dispatch(
                        setHaulsMatrix2Search({
                          ...haulsSearch,
                          vesselLengthRanges: value,
                        }),
                      )
                    }
                    statsSelector={selectVesselLengthFilterGridStatsSorted}
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
                      bgcolor: "primary.main",
                      color: "white",
                      width: "100%",
                      "& .MuiTablePagination-toolbar": { px: 3 },
                    }}
                    component="div"
                    count={hauls.length}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={haulsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Hal per side"}
                    padding="normal"
                  />
                </ListSubheader>
                <Divider
                  sx={{ bgcolor: "secondary.light", mt: 0, mb: 1, mx: 5 }}
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
                          haul.vesselNameErs ??
                          "Ukjent",
                        kilosOrTonsFormatter(sumCatches(haul.catches)) +
                          " - " +
                          dateFormat(haul.startTimestamp, "PPP HH:mm"),
                      ),
                    )}
                  </Box>
                )}
              </List>
            </Box>
          </Drawer>
        </Box>
      )}
    </>
  );
};
