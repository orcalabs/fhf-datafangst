import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocationDisabledIcon from "@mui/icons-material/LocationDisabled";
import { ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { HasTrack, Trip } from "generated/openapi";
import { FC } from "react";
import {
  MenuViewState,
  selectCanReadAisUnder15,
  selectSelectedTrip,
  selectVesselsByFiskeridirId,
  selectViewState,
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
  "&:hover": { bgcolor: "primary.main" },
};

export interface Props {
  trip: Trip;
}

export const TripItem: FC<Props> = ({ trip }) => {
  const dispatch = useAppDispatch();

  const selectedTripId = useAppSelector(selectSelectedTrip)?.tripId;
  const vesselsById = useAppSelector(selectVesselsByFiskeridirId);
  const viewState = useAppSelector(selectViewState);
  const canReadAisUnder15 = useAppSelector(selectCanReadAisUnder15);

  const handleTripChange = () => {
    const newTrip = trip.tripId === selectedTripId ? undefined : trip;
    dispatch(setSelectedTrip(newTrip));
  };

  const showVesselInfo =
    viewState !== MenuViewState.MyPage && viewState !== MenuViewState.Live;

  const hasTrack =
    trip.hasTrack === HasTrack.TrackOver15 ||
    (trip.hasTrack === HasTrack.TrackUnder15 && canReadAisUnder15);

  return (
    <ListItemButton
      dense
      sx={listItemSx}
      selected={selectedTripId === trip.tripId}
      onClick={handleTripChange}
    >
      <ListItemAvatar sx={{ pr: 2 }}>
        <FishIcon width="32" height="32" fill={theme.palette.secondary.main} />
      </ListItemAvatar>
      <ListItemText
        primary={
          !showVesselInfo
            ? dateFormat(trip.end, "PPP")
            : (vesselsById[trip.fiskeridirVesselId]?.fiskeridir.name ??
              "Ukjent")
        }
        secondary={
          !showVesselInfo
            ? kilosOrTonsFormatter(trip.delivery.totalLivingWeight)
            : `${kilosOrTonsFormatter(
                trip.delivery.totalLivingWeight,
              )} - ${dateFormat(trip.end, "PPP")}`
        }
      />
      {hasTrack ? (
        <ListItemAvatar sx={{ pl: 3 }}>
          <GpsFixedIcon sx={{ color: "#7FA380" }} fontSize="small" />
        </ListItemAvatar>
      ) : (
        <ListItemAvatar sx={{ pl: 3 }}>
          <LocationDisabledIcon sx={{ color: "grey.A100" }} fontSize="small" />
        </ListItemAvatar>
      )}
    </ListItemButton>
  );
};
