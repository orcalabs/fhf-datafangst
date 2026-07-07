import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import type { FC } from "react";

interface Props {
  name: string[];
}

export const ZonePopover: FC<Props> = ({ name }) => {
  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5, pl: 0 }}>
            <ShowChartIcon fontSize="large" sx={{ color: "primary.light" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Økonomiske sone"}
            secondary={name[1] ? `${name[0]} - ${name[1]}` : name[0]}
            slotProps={{
              secondary: { color: "primary" },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
