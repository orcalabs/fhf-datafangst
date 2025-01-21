import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import { Box, Divider, styled, SvgIcon, Typography } from "@mui/material";
import chartsTheme from "app/chartsTheme";
import theme from "app/theme";
import { CatchesTable, SecondaryMenuWrapper } from "components";
import ReactEChart from "echarts-for-react";
import { Gear, GearDetailed } from "generated/openapi";
import { FC } from "react";
import {
  MenuViewState,
  selectCurrentTrip,
  selectEstimatedLiveFuelConsumption,
  selectFuelOfTrip,
  selectGearsMap,
  selectViewState,
  useAppSelector,
} from "store";
import {
  createGearListString,
  createObjectDurationString,
  dateFormat,
  fuelTonsToLiters,
  reduceHaulsCatches,
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
  const fuel = useAppSelector(selectFuelOfTrip);
  const viewState = useAppSelector(selectViewState);
  const estimatedLiveFuel = useAppSelector(selectEstimatedLiveFuelConsumption);
  const liveFuelLiters = estimatedLiveFuel?.entries.map((e) => {
    const val = { ...e };
    val.fuel = fuelTonsToLiters(e.fuel);
    return val;
  });

  if (!trip) {
    return <></>;
  }

  const haulCatchesMap = reduceHaulsCatches(trip.hauls);
  const haulCatches = Object.values(haulCatchesMap);

  const tripGears = Object.values(
    trip.hauls.reduce((tot: { [k in Gear]?: GearDetailed }, cur) => {
      tot[cur.gear] = gears[cur.gear];
      return tot;
    }, {}),
  );

  return (
    <SecondaryMenuWrapper>
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

          {fuel && viewState === MenuViewState.MyPage && (
            <InfoItem>
              <SvgIcon sx={iconStyle}>
                <LocalGasStationIcon />
              </SvgIcon>
              <Typography>{fuel.toFixed(0)} L</Typography>
            </InfoItem>
          )}
        </Box>
        <Box sx={{ my: 1, width: "100%" }}>
          <Typography sx={{ fontSize: "1rem" }} variant="h5">
            Estimert fangst
          </Typography>
          <CatchesTable catches={haulCatches} />
        </Box>
        {estimatedLiveFuel && (
          <Box sx={{ width: "100%", my: 1 }}>
            <Typography sx={{ fontSize: "1rem" }} variant="h5">
              Estimert drivstofforbruk
            </Typography>
            <Typography>
              Siden start:{" "}
              {fuelTonsToLiters(estimatedLiveFuel?.total_fuel).toFixed(0)} liter
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
                    lineStyle: {
                      color: theme.palette.grey.A100,
                    },
                  },
                  axisLine: {
                    lineStyle: {
                      color: "white",
                    },
                  },
                  axisLabel: {
                    color: "white",
                  },
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
                  source: liveFuelLiters,
                },

                tooltip: {
                  trigger: "axis",
                },
                series: [
                  {
                    type: "line",
                  },
                ],
              }}
              theme={chartsTheme}
            />
          </Box>
        )}
      </Box>
    </SecondaryMenuWrapper>
  );
};
