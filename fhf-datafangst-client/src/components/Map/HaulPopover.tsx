import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { FC } from "react";
import { selectHaul, useAppSelector } from "store";
import {
  dateFormat,
  kilosOrTonsFormatter,
  sumCatches,
  toTitleCase,
} from "utils";

interface Props {
  haulId: number;
}

export const HaulPopover: FC<Props> = ({ haulId }) => {
  const haul = useAppSelector((s) => selectHaul(s, haulId));

  if (!haul) {
    return <></>;
  }

  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <FishIcon
              fill={theme.palette.primary.light}
              width="36"
              height="36"
            />
          </ListItemIcon>
          <ListItemText
            primary={toTitleCase(haul.vesselName)}
            secondary={
              <span>
                {dateFormat(haul.startTimestamp, "d MMM p")} <br />
                <span>{kilosOrTonsFormatter(sumCatches(haul.catches))}</span>
              </span>
            }
            slotProps={{
              secondary: { color: "primary" },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
