import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { toTitleCase } from "utils";
import { DeliveryPointIcon } from "assets/icons";
import theme from "app/theme";
import { DeliveryPoint } from "generated/openapi";

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
            secondary={
              deliveryPoint.latitude?.toFixed(4) +
              "° N " +
              deliveryPoint.longitude?.toFixed(4) +
              "° Ø"
            }
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
