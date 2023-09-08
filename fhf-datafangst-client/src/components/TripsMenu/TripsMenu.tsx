import {
  Box,
  Divider,
  Drawer,
  IconButton,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import {
  getHaulTrack,
  getLandings,
  resetTrackState,
  selectGearsMap,
  selectSelectedHaul,
  selectVesselsByFiskeridirId,
  setTripDetailsOpen,
  useAppDispatch,
  useAppSelector,
} from "store";
import { selectSelectedTrip, setSelectedTrip } from "store/trip";
import {
  createGearListString,
  createObjectDurationString,
  dateFormat,
  kilosOrTonsFormatter,
  reduceCatchesOnSpecies,
  reduceHaulsCatches,
  sumCatches,
  toTitleCase,
} from "utils";
import { CatchesTable } from "components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import StickyNote2SharpIcon from "@mui/icons-material/StickyNote2Sharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import WarehouseSharpIcon from "@mui/icons-material/WarehouseSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import SettingsIcon from "@mui/icons-material/Settings";

const InfoItem = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

const iconStyle = {
  position: "relative",
  mr: 5,
  color: "white",
} as const;

export const TripsMenu: FC = () => {
  const trip = useAppSelector(selectSelectedTrip);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<boolean>(false);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const gears = useAppSelector(selectGearsMap);

  if (!trip) {
    return <></>;
  }

  const haulCatchesMap = reduceHaulsCatches(trip.hauls);
  const haulCatches = Object.values(haulCatchesMap);
  const catchTotal = sumCatches(haulCatches);

  const deliveryCatchesMap = reduceCatchesOnSpecies(trip.delivery.delivered);
  const tripCatches = Object.values(deliveryCatchesMap);

  const tripGears = trip.gearIds.map((val) => gears[val]);

  return (
    <Box
      sx={{
        height: "100%",
        marginTop: "auto",
      }}
    >
      <Drawer
        sx={{
          height: "100%",
          zIndex: 5000,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            position: "relative",
            backgroundColor: "primary.main",
          },
        }}
        open
        variant="persistent"
        anchor="right"
      >
        <Box
          sx={{
            display: "flex",
            py: 3,
            px: 2.5,
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <AllInclusiveSharpIcon
            width="42"
            height="42"
            sx={{ alignSelf: "center" }}
          />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="h5">LEVERANSE</Typography>
            <Typography color="secondary.light" variant="h6">
              {toTitleCase(
                vessels[trip.fiskeridirVesselId].fiskeridir.name ?? "Ukjent",
              )}
            </Typography>
          </Box>
          <Box sx={{ marginLeft: "auto" }}>
            {process.env.REACT_APP_ENV === "staging" ? (
              <IconButton
                sx={{ color: "text.secondary", borderRadius: 0 }}
                edge="end"
                onClick={() => {
                  dispatch(setTripDetailsOpen(true));
                  dispatch(
                    getLandings({
                      vessels: [vessels[trip.fiskeridirVesselId]],
                    }),
                  );
                }}
              >
                <SettingsIcon />
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton
              onClick={() => {
                dispatch(setSelectedTrip(undefined));
                dispatch(resetTrackState());

                if (selectedHaul) {
                  dispatch(getHaulTrack(selectedHaul));
                }
              }}
            >
              <CloseSharpIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 2.5,
            color: "white",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <WarehouseSharpIcon />
              </SvgIcon>
              <Typography>
                {trip.deliveryPointIds.length
                  ? trip.deliveryPointIds.join(",")
                  : "Ukjent"}
              </Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <CalendarMonthSharpIcon />
              </SvgIcon>
              <Typography>
                {dateFormat(trip.mostRecentDeliveryDate ?? trip.end, "PPP")}
              </Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <TimerSharpIcon />
              </SvgIcon>
              <Typography>{createObjectDurationString(trip)}</Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <PhishingSharpIcon />
              </SvgIcon>
              <Typography>
                {tripGears.length ? createGearListString(tripGears) : "Ukjent"}
              </Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <StickyNote2SharpIcon />
              </SvgIcon>
              <Typography>
                {trip.numDeliveries}{" "}
                {trip.numDeliveries === 1 ? "sluttseddel" : "sluttsedler"}
              </Typography>
            </InfoItem>

            {trip.hauls && (
              <InfoItem id={"haulPopperAnchor_"}>
                <SvgIcon sx={iconStyle}>
                  <LocationOnSharpIcon />
                </SvgIcon>
                <Typography>{trip.hauls.length} hal</Typography>
              </InfoItem>
            )}
          </Box>
          <Box
            sx={{
              my: 1,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "1rem" }} variant="h5">
              Levert fangst
            </Typography>
          </Box>
          <CatchesTable catches={tripCatches} />

          <Box
            onClick={() => setExpanded(!expanded)}
            sx={{
              mt: 5,
              mb: 1,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              "&:hover": { cursor: "pointer" },
            }}
          >
            <Typography
              style={{ display: "flex", alignItems: "center" }}
              variant="h5"
              sx={{ fontSize: "1rem" }}
            >
              Estimert fangst
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Typography>
            {!expanded && (
              <Typography color="text.secondary" variant="h6" fontSize="1rem">
                {kilosOrTonsFormatter(catchTotal)}
              </Typography>
            )}
          </Box>
          {expanded && <CatchesTable catches={haulCatches} />}
        </Box>
      </Drawer>
    </Box>
  );
};
