import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import { Stack, Typography } from "@mui/material";
import type { FC } from "react";
import theme from "~/app/theme";
import type { Haul } from "~/generated/openapi";
import { dateFormat, kilosOrTonsFormatter, sumCatches } from "~/utils";

interface Props {
  haul: Haul;
}
export const DetailedHaulPopover: FC<Props> = ({ haul }) => {
  return (
    <Stack spacing={1} sx={{ p: 1, pr: 1.5, pb: 0.5 }}>
      <Stack direction="row" spacing={1}>
        <PhishingSharpIcon
          fontSize="large"
          sx={{ color: theme.palette.fourth.main }}
        />
        <Stack>
          <Typography
            sx={{ lineHeight: 1.43, fontSize: "0.876rem", fontWeight: 400 }}
          >{`HAL - ${kilosOrTonsFormatter(sumCatches(haul.catches))}`}</Typography>
          <Typography variant="subtitle2">
            {dateFormat(haul.startTimestamp, "d MMM p")}
          </Typography>
        </Stack>
      </Stack>

      <Typography
        variant="subtitle2"
        sx={{
          fontStyle: "italic",
          textAlign: "center",
          color: "#575757",
        }}
      >
        Klikk for mer detaljer
      </Typography>
    </Stack>
  );
};
