import { FC, useState } from "react";
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
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";
import {
  createHaulDurationString,
  dateFormat,
  distanceFormatter,
  kilosOrTonsFormatter,
  sumHaulCatches,
} from "utils";
import { CatchesTable } from "components";
import {
  selectGears,
  selectHauls,
  selectHaulsLoading,
  selectHaulsMenuOpen,
  selectSelectedHaul,
  selectVesselsByHaulId,
  setSelectedHaul,
  useAppDispatch,
  useAppSelector,
} from "store";
import { Haul } from "generated/openapi";
import { FishIcon } from "assets/icons";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";

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

interface Props {
  onHaulChange?: (haul: Haul | undefined) => void;
}

export const HaulsMenu: FC<Props> = (props) => {
  const { onHaulChange } = props;
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectHaulsMenuOpen);
  const vessels = useAppSelector(selectVesselsByHaulId);
  const gears = useAppSelector(selectGears);
  const hauls = useAppSelector(selectHauls);
  const haulsLoading = useAppSelector(selectHaulsLoading);
  const selectedHaulId = useAppSelector(selectSelectedHaul)?.haulId;

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [haulsPerPage, setHaulsPerPage] = useState<number>(10);
  const indexOfLastHaul = currentPage + 1 * haulsPerPage;
  const indexOfFirstHaul = indexOfLastHaul - haulsPerPage;
  const currentHauls = hauls.slice(indexOfFirstHaul, indexOfLastHaul);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(setSelectedHaul({ haul: undefined }));
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
    dispatch(setSelectedHaul({ haul: newHaul }));
    onHaulChange?.(newHaul);
  };

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
          <FishIcon width="48" height="48" fill={"white"} />
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
              {item(
                PhishingSharpIcon,
                haul?.gearFiskeridirId
                  ? gears[haul.gearFiskeridirId].name
                  : "Ukjent",
              )}
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
        <Box
          sx={{
            height: "100%",
          }}
        >
          <Drawer
            sx={{
              height: "100%",
              "& .MuiDrawer-paper": {
                flexShrink: 0,
                boxSizing: "border-box",
                height: "100%",
                position: "relative",
                backgroundColor: "primary.main",
              },
            }}
            open
            variant="persistent"
            anchor="right"
          >
            <Box sx={{ flexGrow: 1, overflowY: "auto", height: "90%" }}>
              <List sx={{ color: "white", pt: 0 }}>
                <ListSubheader sx={{ px: 0, borderBottom: "1px solid white" }}>
                  <TablePagination
                    sx={{
                      bgcolor: "primary.main",
                      width: "100%",
                      color: "white",
                      "& .MuiTablePagination-toolbar": { p: 0 },
                    }}
                    component="div"
                    count={hauls.length}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    rowsPerPage={haulsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Hal per side"}
                    padding="none"
                  />
                </ListSubheader>

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
                        vessels[haul.haulId]?.fiskeridir?.name ?? "Ukjent",
                        kilosOrTonsFormatter(sumHaulCatches(haul.catches)) +
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
