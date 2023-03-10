import { FC } from "react";
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
import theme from "app/theme";
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
import { FishLocationIcon } from "assets/icons";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";

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
  "&:hover": { bgcolor: "primary.main" },
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
            marginTop: "6px",
            marginBottom: "6px",
            alignItems: "center",
            "& svg": { mr: 2 },
          }}
        >
          <FishLocationIcon
            width="48"
            height="48"
            fill={theme.palette.secondary.main}
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
      <SvgIcon sx={{ position: "relative", color: "secondary.main" }}>
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
            marginTop: "auto",
          }}
        >
          <Drawer
            sx={{
              height: "100%",

              flexShrink: 0,
              "& .MuiDrawer-paper": {
                position: "relative",
                backgroundColor: "primary.light",
              },
            }}
            open
            variant="persistent"
            anchor="right"
          >
            <Box id="catch-menu" sx={{ overflowY: "auto" }}>
              <List sx={{ color: "white", pt: 0 }}>
                <ListSubheader
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: "primary.light",
                    pl: 2.5,
                    pr: 0,
                    pt: 1,
                  }}
                >
                  Hal
                </ListSubheader>

                {haulsLoading ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Laster...</Box>
                ) : !hauls?.length ? (
                  <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater</Box>
                ) : (
                  <>
                    {hauls?.map((haul, index) =>
                      listItem(
                        haul,
                        index,
                        vessels[haul.haulId]?.fiskeridir.name ?? "Ukjent",
                        kilosOrTonsFormatter(sumHaulCatches(haul.catches)) +
                          " - " +
                          dateFormat(haul.startTimestamp, "PPP HH:mm"),
                      ),
                    )}
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </Box>
      )}
      ;
    </>
  );
};
