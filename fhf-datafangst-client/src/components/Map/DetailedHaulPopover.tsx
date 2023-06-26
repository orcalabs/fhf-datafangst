import { FC } from "react";
import { Box, Divider, SvgIcon, Typography } from "@mui/material";
import { createHaulDurationString, dateFormat, distanceFormatter } from "utils";
import { selectGearsMap, useAppSelector } from "store";
import { Haul } from "generated/openapi";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import StraightenIcon from "@mui/icons-material/Straighten";
import { CatchesTable } from "components";
import { FishIcon } from "assets/icons";
import theme from "app/theme";

interface Props {
  haul: Haul;
}

export const DetailedHaulPopover: FC<Props> = ({ haul }) => {
  const gears = useAppSelector(selectGearsMap);

  if (!haul) {
    return <></>;
  }

  const item = (Icon: any, text: string) => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SvgIcon sx={{ position: "relative", color: "white" }}>
        <Icon width={20} height={20} />
      </SvgIcon>
      <Typography sx={{ color: "white" }}>{text}</Typography>
    </Box>
  );

  return (
    <Box sx={{ px: 2, py: 1, bgcolor: "fourth.dark" }}>
      {haul && (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              "& svg": { mr: 2 },
            }}
          >
            <Box sx={{ display: "flex", color: "white" }}>
              <FishIcon
                fill={theme.palette.secondary.main}
                width="36"
                height="36"
              />
              <Box sx={{ display: "flex", ml: 1, alignItems: "center" }}>
                <Typography variant="h5" color="white">
                  HAL
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ bgcolor: "text.secondary", mt: 0, mb: 1, mx: 0 }} />

            {item(
              CalendarMonthSharpIcon,
              dateFormat(haul.startTimestamp, "d. MMM HH:mm") +
                " - " +
                dateFormat(haul.stopTimestamp, "d. MMM HH:mm yyyy"),
            )}
            {item(TimerSharpIcon, createHaulDurationString(haul))}
            {item(StraightenIcon, distanceFormatter(haul.haulDistance ?? 0))}
            {item(PhishingSharpIcon, gears[haul.gearId].name)}
          </Box>

          <Typography
            sx={{
              color: "white",
              mt: 3,
            }}
          >
            Estimert fangst
          </Typography>
          <CatchesTable catches={haul.catches} />
        </Box>
      )}
    </Box>
  );
};
