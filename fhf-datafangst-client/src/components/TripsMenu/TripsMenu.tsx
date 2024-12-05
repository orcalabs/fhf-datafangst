import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import StickyNote2SharpIcon from "@mui/icons-material/StickyNote2Sharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  styled,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DeliveryPointIcon, FishIcon, FishLocationIcon } from "assets/icons";
import { CatchesTable, SecondaryMenuWrapper } from "components";
import { TripAssemblerId } from "generated/openapi";
import { FC, useState } from "react";
import {
  getHaulTrack,
  getLandings,
  getTripTrack,
  MenuViewState,
  resetTrackState,
  selectDeliveryPointsMap,
  selectFuelOfTrip,
  selectGearsMap,
  selectSelectedHaul,
  selectSelectedTrip,
  selectTripTrackIdentifier,
  selectVesselsByFiskeridirId,
  selectViewState,
  setSelectedTrip,
  setTripDetailsOpen,
  TripTrackIdentifier,
  useAppDispatch,
  useAppSelector,
} from "store";
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
  const identifier = useAppSelector(selectTripTrackIdentifier);
  const fuel = useAppSelector(selectFuelOfTrip);
  const viewState = useAppSelector(selectViewState);
  const deliveryPoints = useAppSelector(selectDeliveryPointsMap);

  const [aisToggle, setAisToggle] = useState<TripTrackIdentifier>(identifier);

  if (!trip) {
    return <></>;
  }
  const haulCatchesMap = reduceHaulsCatches(trip.hauls);
  const haulCatches = Object.values(haulCatchesMap);
  const catchTotal = sumCatches(haulCatches);

  const deliveryCatchesMap = reduceCatchesOnSpecies(trip.delivery.delivered);
  const tripCatches = Object.values(deliveryCatchesMap);

  // Use gear from landing notes as priority. If not landing, use gears described in hauls.
  const tripGears = trip.gearIds.length
    ? trip.gearIds.map((val) => gears[val])
    : Array.from(new Set(trip.hauls.map((h) => gears[h.gear])));

  // Return names of deliverypoints, ID if we're missing name
  const createDeliveryPointNamesList = (deliveryPointIds: string[]) => {
    const res: string[] = [];
    for (const id of deliveryPointIds) {
      const dp = deliveryPoints[id];
      res.push(dp?.name ? toTitleCase(dp.name) : dp.id);
    }
    return res.join(", ");
  };

  return (
    <SecondaryMenuWrapper>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{
          py: 3,
          px: 2.5,
          bgcolor: "primary.light",
          color: "white",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <FishIcon width="32" height="26" />
          <Stack>
            <Typography variant="h5">LEVERANSE</Typography>
            <Typography color="secondary.light" variant="h6">
              {toTitleCase(
                vessels[trip.fiskeridirVesselId].fiskeridir.name ?? "Ukjent",
              )}
            </Typography>
          </Stack>
        </Stack>
        {process.env.REACT_APP_ENV === "staging" ? (
          <>
            <ToggleButtonGroup
              color="secondary"
              orientation="vertical"
              size="small"
              value={aisToggle}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setAisToggle(value);
                  dispatch(getTripTrack({ trip, identifier: value }));
                }
              }}
            >
              <ToggleButton
                sx={{ height: 25 }}
                value={TripTrackIdentifier.TripId}
              >
                TripId
              </ToggleButton>
              <ToggleButton
                sx={{ height: 25 }}
                value={TripTrackIdentifier.MmsiCallSign}
              >
                Mmsi/CallSign
              </ToggleButton>
            </ToggleButtonGroup>
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
          </>
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
      </Stack>
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
          {trip.deliveryPointIds.length !== 0 && (
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <DeliveryPointIcon width="20" height="20" x="2px" y="2px" />
              </SvgIcon>
              <Typography>
                {createDeliveryPointNamesList(trip.deliveryPointIds)}
              </Typography>
            </InfoItem>
          )}
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
              {trip.numDeliveries}
              {trip.numDeliveries === 1 ? " sluttseddel" : " sluttsedler"}
            </Typography>
          </InfoItem>
          {trip.hauls && (
            <InfoItem id={"haulPopperAnchor_"}>
              <SvgIcon sx={iconStyle}>
                <FishLocationIcon width="24" height="22" />
              </SvgIcon>
              <Typography>{trip.hauls.length} hal</Typography>
            </InfoItem>
          )}
          {trip.fuelConsumption && (
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <LocalGasStationIcon />
              </SvgIcon>
              <Typography>
                {kilosOrTonsFormatter(trip.fuelConsumption * 1_000)}
              </Typography>
            </InfoItem>
          )}
          {fuel && viewState === MenuViewState.MyPage && (
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <LocalGasStationIcon />
              </SvgIcon>
              <Typography>{fuel.toFixed(0)} L</Typography>
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

        {trip.tripAssemblerId === TripAssemblerId.Ers &&
          Boolean(trip.hauls.length) && (
            <>
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
                  {expanded ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </Typography>
                {!expanded && (
                  <Typography
                    color="text.secondary"
                    variant="h6"
                    fontSize="1rem"
                  >
                    {kilosOrTonsFormatter(catchTotal)}
                  </Typography>
                )}
              </Box>
              {expanded && <CatchesTable catches={haulCatches} />}
            </>
          )}
      </Box>
    </SecondaryMenuWrapper>
  );
};
