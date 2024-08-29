import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FC } from "react";

interface Props {
  name: string;
}

export const ShorelinePopover: FC<Props> = ({ name }) => {
  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5, pl: 0 }}>
            <ShowChartIcon fontSize="large" sx={{ color: "primary.light" }} />
          </ListItemIcon>
          <ListItemText
            primary={"Fartsområde kystfiske"}
            secondary={name}
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
