import {
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { LocalLoadingProgress, PaginationButtons } from "components";
import { Trip } from "generated/openapi";
import { FC } from "react";
import {
  paginateTripsSearch,
  selectSelectedTrip,
  selectTrips,
  selectTripsLoading,
  selectTripsSearch,
  setSelectedTrip,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat, kilosOrTonsFormatter } from "utils";

const listItemSx = {
  px: 2.5,
  "&.Mui-selected": {
    bgcolor: "primary.dark",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "&:hover": { bgcolor: "primary.light" },
};

export const MyTrips: FC = () => {
  const dispatch = useAppDispatch();
  const tripsLoading = useAppSelector(selectTripsLoading);
  const trips = useAppSelector(selectTrips);
  const selectedTripId = useAppSelector(selectSelectedTrip)?.tripId;
  const tripsSearch = useAppSelector(selectTripsSearch);

  const offset = tripsSearch?.offset ?? 0;
  const limit = tripsSearch?.limit ?? 10;

  const handleTripsPagination = (offset: number, limit: number) => {
    dispatch(paginateTripsSearch({ offset, limit }));
  };

  const handleTripChange = (trip: Trip) => {
    const newTrip = trip.tripId === selectedTripId ? undefined : trip;
    dispatch(setSelectedTrip(newTrip));
  };

  return (
    <List sx={{ color: "white", pt: 0 }}>
      {tripsLoading ? (
        <Box sx={{ pt: 2, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : !trips?.length && offset === 0 ? (
        <Box sx={{ py: 1, pl: 2.5 }}>Ingen resultater</Box>
      ) : (
        <>
          {trips?.map((t) => (
            <ListItemButton
              dense
              key={t.tripId}
              sx={listItemSx}
              selected={selectedTripId === t.tripId}
              onClick={() => handleTripChange(t)}
            >
              <ListItemAvatar sx={{ pr: 2 }}>
                <FishIcon
                  width="32"
                  height="32"
                  fill={theme.palette.secondary.main}
                />
              </ListItemAvatar>
              <ListItemText
                primary={dateFormat(t.end, "PPP")}
                secondary={kilosOrTonsFormatter(t.delivery.totalLivingWeight)}
              />
            </ListItemButton>
          ))}

          <Box sx={{ mt: 1 }}>
            <PaginationButtons
              numItems={trips?.length ?? 0}
              offset={offset}
              limit={limit}
              onPaginationChange={handleTripsPagination}
            />
          </Box>
        </>
      )}
    </List>
  );
};
