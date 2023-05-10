import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { dateFormat } from "utils";
import { AisVmsPosition } from "generated/openapi";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Props {
  hoveredPosition: AisVmsPosition;
}

export const PositionPopover: FC<Props> = ({ hoveredPosition }) => {
  if (!hoveredPosition.det) {
    return <> </>;
  }
  return (
    <Box sx={{ pr: 1, pl: 0.5 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5, pl: 0 }}>
            <LocationOnIcon fontSize="large" sx={{ color: "third.main" }} />
          </ListItemIcon>
          <ListItemText
            primary={dateFormat(hoveredPosition.timestamp, "d MMM p")}
            secondary={
              hoveredPosition.speed
                ? Number(hoveredPosition.speed).toFixed(1) + " knop"
                : "Ukjent fart"
            }
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
