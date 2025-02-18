import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Divider, Stack, Typography } from "@mui/material";
import { AisVmsPosition } from "generated/openapi";
import { FC } from "react";
import { dateFormat } from "utils";

interface Props {
  hoveredPosition: AisVmsPosition;
}

const textStyle = {
  lineHeight: 1.43,
  fontSize: "0.876rem",
  fontWeight: 400,
};

export const PositionPopover: FC<Props> = ({ hoveredPosition }) => {
  return (
    <Stack sx={{ p: 1, pl: 0.5 }} spacing={1}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <LocationOnIcon fontSize="large" sx={{ color: "third.main" }} />
        <Stack>
          <Typography sx={textStyle}>
            {dateFormat(hoveredPosition.timestamp, "d MMM p")}
          </Typography>
          <Typography
            sx={{
              color: "primary.main",
              lineHeight: 1.43,
              fontSize: "0.876rem",
              fontWeight: 400,
            }}
          >
            {Number.isFinite(hoveredPosition.speed)
              ? hoveredPosition.speed!.toFixed(1) + " knop"
              : "Ukjent fart"}
          </Typography>
        </Stack>
      </Stack>
      {hoveredPosition.tripCumulativeFuelConsumption && (
        <>
          <Divider />
          <Stack sx={{ px: 1 }} alignItems="center">
            <Typography
              sx={{
                ...textStyle,
                fontStyle: "italic",
                color: "#575757",
                fontSize: "0.82rem",
              }}
            >
              Estimert drivstoff
            </Typography>
            <Typography sx={textStyle}>
              {hoveredPosition.tripCumulativeFuelConsumption.toFixed(1) +
                " liter"}
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};
