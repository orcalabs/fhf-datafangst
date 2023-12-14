import {
  Box,
  Divider,
  Drawer,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import { FC } from "react";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import { selectGearsMap, useAppSelector } from "store";
import { selectCurrentTrip } from "store/trip";
import {
  createGearListString,
  createObjectDurationString,
  dateFormat,
  reduceHaulsCatches,
} from "utils";
import { CatchesTable } from "components";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import { Gear, GearDetailed } from "generated/openapi";

const InfoItem = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

const iconStyle = {
  position: "relative",
  mr: 5,
  color: "white",
} as const;

export const CurrentTripMenu: FC = () => {
  const trip = useAppSelector(selectCurrentTrip);
  const gears = useAppSelector(selectGearsMap);

  if (!trip) {
    return <></>;
  }

  const haulCatchesMap = reduceHaulsCatches(trip.hauls);
  const haulCatches = Object.values(haulCatchesMap);

  const tripGears = Object.values(
    trip.hauls.reduce((tot: { [k in Gear]?: GearDetailed }, cur) => {
      tot[cur.gearId] = gears[cur.gearId];
      return tot;
    }, {}),
  );

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
            backgroundColor: "primary.light",
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
            backgroundColor: "primary.light",
            color: "white",
          }}
        >
          <AllInclusiveSharpIcon
            width="42"
            height="42"
            sx={{ alignSelf: "center" }}
          />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="h5">NÅVÆRENDE TUR</Typography>
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
                <CalendarMonthSharpIcon />
              </SvgIcon>
              <Typography>{dateFormat(trip.departure, "PPP")}</Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <TimerSharpIcon />
              </SvgIcon>
              <Typography>
                {createObjectDurationString({
                  start: trip.departure,
                  end: new Date(),
                })}
              </Typography>
            </InfoItem>
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <PhishingSharpIcon />
              </SvgIcon>
              <Typography> {createGearListString(tripGears)} </Typography>
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
              Estimert fangst
            </Typography>
          </Box>
          <CatchesTable catches={haulCatches} />
        </Box>
      </Drawer>
    </Box>
  );
};
