import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  dateFormat,
  kilosOrTonsFormatter,
  sumCatches,
  toTitleCase,
} from "utils";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { Haul } from "generated/openapi";

interface Props {
  haul: Haul;
}

export const HaulPopover: FC<Props> = ({ haul }) => {
  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <FishIcon
              fill={theme.palette.primary.main}
              width="36"
              height="36"
            />
          </ListItemIcon>
          <ListItemText
            primary={toTitleCase(haul.vesselName ?? haul.vesselNameErs)}
            secondary={
              <span>
                {dateFormat(haul.startTimestamp, "d MMM p")} <br />
                <span>{kilosOrTonsFormatter(sumCatches(haul.catches))}</span>
              </span>
            }
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
