import {
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { TripsArgs } from "api";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import {
  LocalLoadingProgress,
  PaginationButtons,
  SearchFilters,
} from "components";
import { Trip } from "generated/openapi";
import { FC, useEffect } from "react";
import {
  MenuViewState,
  paginateTripsSearch,
  selectBwUserProfile,
  selectSelectedTrip,
  selectTrips,
  selectTripsLoading,
  selectTripsSearch,
  selectVesselsByCallsign,
  selectVesselsByFiskeridirId,
  selectViewState,
  setSelectedTrip,
  setTripsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat, kilosOrTonsFormatter, withoutKeys } from "utils";

const listItemSx = {
  px: 2.5,
  "&.Mui-selected": {
    bgcolor: "primary.dark",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "&:hover": { bgcolor: "primary.light" },
};

const filterParams: TripsArgs = {
  dateRange: undefined,
  vessels: undefined,
  speciesGroups: undefined,
  gearGroups: undefined,
  vesselLengthGroups: undefined,
  weight: undefined,
  sorting: undefined,
};

export const Trips: FC = () => {
  const dispatch = useAppDispatch();
  const tripsLoading = useAppSelector(selectTripsLoading);
  const trips = useAppSelector(selectTrips);
  const selectedTripId = useAppSelector(selectSelectedTrip)?.tripId;
  const tripsSearch = useAppSelector(selectTripsSearch);
  const profile = useAppSelector(selectBwUserProfile);
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vesselsById = useAppSelector(selectVesselsByFiskeridirId);
  const vesselInfo = profile?.vesselInfo;
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const viewState = useAppSelector(selectViewState);

  const offset = tripsSearch?.offset ?? 0;
  const limit = tripsSearch?.limit ?? 10;

  const activeFilterParams =
    viewState === MenuViewState.MyPage
      ? {
          ...withoutKeys(filterParams, "vessels", "vesselLengthGroups"),
          ...withoutKeys(tripsSearch, "vessels"),
        }
      : { ...filterParams, ...tripsSearch };

  const handleTripsPagination = (offset: number, limit: number) => {
    dispatch(paginateTripsSearch({ offset, limit }));
  };

  const handleTripChange = (trip: Trip) => {
    const newTrip = trip.tripId === selectedTripId ? undefined : trip;
    dispatch(setSelectedTrip(newTrip));
  };

  useEffect(() => {
    if (vessel && viewState === MenuViewState.MyPage) {
      dispatch(setTripsSearch({ ...tripsSearch, vessels: [vessel] }));
    } else {
      dispatch(setTripsSearch({ ...tripsSearch }));
    }
  }, []);

  return (
    <List sx={{ color: "white", pt: 0 }}>
      <ListSubheader
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          pl: 2.5,
          pr: 0,
          pt: viewState === MenuViewState.MyPage ? 0 : 1,
          lineHeight: viewState === MenuViewState.MyPage ? "40px" : "48px",
        }}
      >
        Leveranser
        <SearchFilters
          params={activeFilterParams}
          onChange={(value) =>
            dispatch(setTripsSearch({ ...tripsSearch, ...value, offset: 0 }))
          }
        />
      </ListSubheader>
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
                primary={
                  viewState === MenuViewState.MyPage
                    ? dateFormat(t.end, "PPP")
                    : vesselsById[t.fiskeridirVesselId]?.fiskeridir.name ??
                      "Ukjent"
                }
                secondary={
                  viewState === MenuViewState.MyPage
                    ? kilosOrTonsFormatter(t.delivery.totalLivingWeight)
                    : `${kilosOrTonsFormatter(
                        t.delivery.totalLivingWeight,
                      )} - ${dateFormat(t.end, "PPP")}`
                }
              />
            </ListItemButton>
          ))}

          <Box sx={{ mt: 1, mr: viewState === MenuViewState.MyPage ? 2 : 0 }}>
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
