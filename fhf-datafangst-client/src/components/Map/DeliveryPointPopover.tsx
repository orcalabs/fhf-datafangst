import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import theme from "app/theme";
import { DeliveryPointIcon } from "assets/icons";
import { DeliveryPoint } from "generated/openapi";
import { FC } from "react";
import { toTitleCase } from "utils";

interface Props {
  deliveryPoint: DeliveryPoint;
}

export const DeliveryPointPopover: FC<Props> = ({ deliveryPoint }) => {
  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <DeliveryPointIcon
              fill={theme.palette.fourth.main}
              width="36"
              height="36"
            />
          </ListItemIcon>
          <ListItemText
            primary={toTitleCase(deliveryPoint.name ?? deliveryPoint.id)}
            secondary={deliveryPoint.id}
            secondaryTypographyProps={{ color: "secondary.dark" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
