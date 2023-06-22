import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { dateFormat } from "utils";
import theme from "app/theme";
import {
  selectFishingFacility,
  selectSelectedTrip,
  useAppSelector,
} from "store";
import PhishingSharp from "@mui/icons-material/PhishingSharp";
import { FishingFacilityToolTypes } from "models";

interface Props {
  fishingFacilityIdx: number;
}

export const FishingFacilityPopover: FC<Props> = ({ fishingFacilityIdx }) => {
  let facility = useAppSelector(selectFishingFacility(fishingFacilityIdx));
  const trip = useAppSelector(selectSelectedTrip);

  // Fishing facility may be part of Trip instead of in state.
  if (trip && !facility) {
    facility = trip.fishingFacilities[fishingFacilityIdx];
  }

  if (!facility) {
    return <></>;
  }

  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <PhishingSharp
              fill={theme.palette.primary.main}
              width="36"
              height="36"
            />
          </ListItemIcon>
          <ListItemText
            primary={
              FishingFacilityToolTypes[facility.toolType] +
              (facility.toolCount ? ` (${facility.toolCount})` : "")
            }
            secondary={
              <span>
                {dateFormat(facility.setupTimestamp, "d MMM YYY") +
                  (facility.removedTimestamp
                    ? ` - ${dateFormat(facility.removedTimestamp, "d MMM YYY")}`
                    : "")}
                <br />
                {facility.comment}
              </span>
            }
            secondaryTypographyProps={{ color: "primary" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};
