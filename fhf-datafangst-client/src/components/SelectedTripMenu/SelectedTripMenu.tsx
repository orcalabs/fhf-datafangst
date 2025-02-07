import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import StickyNote2SharpIcon from "@mui/icons-material/StickyNote2Sharp";
import StraightenSharpIcon from "@mui/icons-material/StraightenSharp";
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
import { CatchesTable } from "components";
import { AppPage } from "containers/App/App";
import { addMonths, getMonth, getYear, subMonths } from "date-fns";
import { TripAssemblerId } from "generated/openapi";
import { FC, useMemo, useState } from "react";
import {
  getHaulTrack,
  getLandings,
  getTripTrack,
  resetTrackState,
  selectAppPage,
  selectDeliveryPointsMap,
  selectFuelOfTrip,
  selectGearsMap,
  selectSelectedHaul,
  selectSelectedTrip,
  selectTripTrackIdentifier,
  selectVesselsByFiskeridirId,
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
  metersToNatuticalMilesString,
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

export const SelectedTripMenu: FC = () => {
  const dispatch = useAppDispatch();

  const trip = useAppSelector(selectSelectedTrip);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const gears = useAppSelector(selectGearsMap);
  const identifier = useAppSelector(selectTripTrackIdentifier);
  const fuel = useAppSelector(selectFuelOfTrip);
  const appPage = useAppSelector(selectAppPage);
  const deliveryPoints = useAppSelector(selectDeliveryPointsMap);

  const [expanded, setExpanded] = useState<boolean>(false);
  const [aisToggle, setAisToggle] = useState<TripTrackIdentifier>(identifier);

  const { haulCatches, catchTotal } = useMemo(() => {
    const haulCatches = trip?.hauls.flatMap((h) => h.catches) ?? [];
    const catchTotal = sumCatches(haulCatches);
    return { haulCatches, catchTotal };
  }, [trip?.hauls]);

  // Use gear from landing notes as priority. If not landing, use gears described in hauls.
  const tripGears = useMemo(
    () =>
      trip
        ? trip.gearIds.length
          ? trip.gearIds.map((val) => gears[val])
          : Array.from(new Set(trip.hauls.map((h) => gears[h.gear])))
        : [],
    [trip?.gearIds, trip?.hauls, gears],
  );

  const deliveryPointNames = useMemo(
    () =>
      trip?.deliveryPointIds
        .map((id) => {
          const dp = deliveryPoints[id];
          return dp?.name ? toTitleCase(dp.name) : id;
        })
        .join(",") ?? "",
    [trip?.deliveryPointIds, deliveryPoints],
  );

  if (!trip) {
    return <></>;
  }

  return (
    <>
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
                    years: [
                      getYear(subMonths(new Date(trip.start), 1)),
                      getYear(addMonths(new Date(trip.end), 1)),
                    ],
                    months: [
                      getMonth(subMonths(new Date(trip.start), 1)),
                      getMonth(new Date(trip.start)),
                      getMonth(new Date(trip.end)),
                      getMonth(subMonths(new Date(trip.end), 1)),
                      getMonth(addMonths(new Date(trip.end), 1)),
                    ],
                    limit: 100,
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
            dispatch(setTripDetailsOpen(false));

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
              <Typography>{deliveryPointNames}</Typography>
            </InfoItem>
          )}
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <CalendarMonthSharpIcon />
            </SvgIcon>
            <Typography>{dateFormat(trip.end, "PPP")}</Typography>
          </InfoItem>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <TimerSharpIcon />
            </SvgIcon>
            <Typography>{createObjectDurationString(trip)}</Typography>
          </InfoItem>
          {trip.distance && (
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <StraightenSharpIcon />
              </SvgIcon>
              <Typography>
                {metersToNatuticalMilesString(trip.distance)}
              </Typography>
            </InfoItem>
          )}
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
          {fuel && appPage === AppPage.MyPage && (
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
        <CatchesTable
          catches={trip.delivery.delivered}
          isEstimatedValue={trip.delivery.priceForFisherIsEstimated}
        />

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
                  sx={{ fontSize: "1rem", lineHeight: 1.6 }}
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
    </>
  );
};
