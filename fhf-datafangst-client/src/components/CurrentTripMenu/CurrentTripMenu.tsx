import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Box,
  Divider,
  Stack,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import chartsTheme from "app/chartsTheme";
import theme from "app/theme";
import { CatchesTable } from "components";
import ReactEChart from "echarts-for-react";
import { Gear, GearDetailed } from "generated/openapi";
import { FC, useMemo } from "react";
import {
  selectCurrentTrip,
  selectEstimatedLiveFuelConsumption,
  selectGearsMap,
  useAppSelector,
} from "store";
import {
  createGearListString,
  createObjectDurationString,
  dateFormat,
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

export const CurrentTripMenu: FC = () => {
  const trip = useAppSelector(selectCurrentTrip);
  const gears = useAppSelector(selectGearsMap);
  const estimatedLiveFuel = useAppSelector(selectEstimatedLiveFuelConsumption);

  const tripGears = useMemo(
    () =>
      trip?.hauls
        ? Object.values(
            trip.hauls.reduce((tot: { [k in Gear]?: GearDetailed }, cur) => {
              tot[cur.gear] = gears[cur.gear];
              return tot;
            }, {}),
          )
        : [],
    [trip?.hauls],
  );

  if (!trip) {
    return <></>;
  }

  return (
    <>
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
            <Typography>
              {tripGears.length ? createGearListString(tripGears) : "Ukjent"}
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
        <Stack sx={{ py: 1, width: "100%" }} spacing={0.5}>
          <Typography sx={{ fontSize: "1rem" }} variant="h5">
            Rapportert fangst
          </Typography>
          <CatchesTable catches={trip.hauls.flatMap((h) => h.catches)} />
        </Stack>
        {estimatedLiveFuel && (
          <Stack sx={{ width: "100%", py: 3 }}>
            <Typography sx={{ fontSize: "1rem", pb: 0.5 }} variant="h5">
              Estimert drivstofforbruk
            </Typography>
            <Typography sx={{ color: "text.secondary", px: 3 }}>
              Siste 24 timer: {estimatedLiveFuel.totalFuel.toFixed(0)} liter
            </Typography>
            <ReactEChart
              option={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.fifth.main,
                textStyle: {
                  color: "white",
                },
                xAxis: {
                  type: "time",
                  splitLine: {
                    show: false,
                  },
                  axisLine: {
                    lineStyle: {
                      color: "white",
                    },
                  },
                  axisLabel: {
                    color: "white",
                    formatter: "{HH}:{mm}",
                  },
                  minInterval: 3600 * 4 * 1000,
                },
                yAxis: {
                  type: "value",
                  name: "Liter",
                  axisLine: {
                    lineStyle: {
                      color: "white",
                    },
                  },
                  splitLine: {
                    lineStyle: {
                      color: theme.palette.grey.A100,
                    },
                  },
                  axisLabel: {
                    color: "white",
                  },
                },
                dataset: {
                  dimensions: ["timestamp", "fuel"],
                  source: estimatedLiveFuel.entries,
                },

                tooltip: {
                  trigger: "axis",
                  valueFormatter: (fuel: number | null) =>
                    fuel !== null && fuel.toFixed(2),
                },
                series: [
                  {
                    type: "line",
                    encode: { tooltip: [1] },
                  },
                ],
              }}
              theme={chartsTheme}
            />
          </Stack>
        )}
      </Box>
    </>
  );
};
