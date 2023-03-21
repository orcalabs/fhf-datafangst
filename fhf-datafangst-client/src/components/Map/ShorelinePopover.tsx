import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export const ShorelinePopover: FC = () => {
  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5, pl: 0 }}>
            <ShowChartIcon fontSize="large" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Fartsområde kystfiske"}
            secondary={"12 nautiske mil"}
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
