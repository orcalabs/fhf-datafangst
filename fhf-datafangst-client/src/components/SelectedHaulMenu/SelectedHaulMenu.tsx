import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import StraightenIcon from "@mui/icons-material/Straighten";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  styled,
  SvgIcon,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { GearConfig } from "~/components";
import {
  selectGearsMap,
  selectSelectedTripHaul,
  setSelectedTripHaul,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import {
  createObjectDurationString,
  dateFormat,
  kilosOrTonsFormatter,
  metersToNatuticalMilesString,
  sumCatches,
} from "~/utils";
import { CatchesTable } from "../SecondaryMenu/CatchesTable";

const InfoItem = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

const iconStyle = {
  position: "relative",
  mr: 5,
  color: "white",
} as const;

export const SelectedHaulMenu: FC = () => {
  const dispatch = useAppDispatch();

  const selectedHaul = useAppSelector(selectSelectedTripHaul);
  const gears = useAppSelector(selectGearsMap);

  const [expanded, setExpanded] = useState<boolean>(false);

  if (!selectedHaul) {
    return <></>;
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{
          py: 3,
          px: 2.5,
          bgcolor: "primary.light",
          color: "white",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <PhishingSharpIcon width="32" height="26" />
          <Stack>
            <Typography variant="h5">HAL</Typography>
            <Typography sx={{ color: "secondary.light" }} variant="h6">
              {selectedHaul?.catches
                ? kilosOrTonsFormatter(sumCatches(selectedHaul.catches))
                : "Ukjent fangstmengde"}
            </Typography>
          </Stack>
        </Stack>
        <IconButton
          onClick={() => {
            dispatch(setSelectedTripHaul(undefined));
          }}
        >
          <CloseSharpIcon sx={{ color: "white" }} />
        </IconButton>
      </Stack>
      <Divider sx={{ bgcolor: "text.secondary", mb: 2, mx: 4 }} />
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 2.5,
          color: "white",
        }}
        spacing={2}
      >
        <Box sx={{ mb: 1 }}>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <CalendarMonthSharpIcon />
            </SvgIcon>
            <Typography sx={{ color: "white" }}>
              {dateFormat(selectedHaul.startTimestamp, "d. MMM HH:mm yyyy") +
                " - " +
                dateFormat(selectedHaul.stopTimestamp, "d. MMM HH:mm yyyy")}
            </Typography>
          </InfoItem>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <TimerSharpIcon />
            </SvgIcon>
            <Typography sx={{ color: "white" }}>
              {createObjectDurationString({
                start: selectedHaul.startTimestamp,
                end: selectedHaul.stopTimestamp,
              })}
            </Typography>
          </InfoItem>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <StraightenIcon />
            </SvgIcon>
            <Typography sx={{ color: "white" }}>
              {metersToNatuticalMilesString(selectedHaul.haulDistance ?? 0)}
            </Typography>
          </InfoItem>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <PhishingSharpIcon />
            </SvgIcon>
            <Typography sx={{ color: "white" }}>
              {gears[selectedHaul.gear].name}
            </Typography>
          </InfoItem>
          <InfoItem>
            <SvgIcon sx={iconStyle}>
              <LocalGasStationIcon />
            </SvgIcon>
            <Typography>
              {selectedHaul.startFuelLiter && selectedHaul.endFuelLiter
                ? `${selectedHaul.startFuelLiter - selectedHaul.endFuelLiter} liter`
                : "Ukjent"}
            </Typography>
          </InfoItem>
        </Box>
        <Stack spacing={4} sx={{ width: "100%" }}>
          <Stack sx={{ width: "100%" }} spacing={1}>
            <Typography sx={{ fontSize: "1rem" }} variant="h5">
              Rapportert fangst
            </Typography>
            <CatchesTable catches={selectedHaul?.catches} />
          </Stack>

          {selectedHaul.config && (
            <Stack>
              <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
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
                  Redskapskonfigurasjon
                  {expanded ? (
                    <KeyboardArrowUpIcon sx={{ ml: "2px" }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ ml: "2px" }} />
                  )}
                </Typography>
              </Box>
              {expanded && <GearConfig haul={selectedHaul} />}
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};
