import { Box, List, ListSubheader } from "@mui/material";
import {
  LocalLoadingProgress,
  PaginationButtons,
  VesselInfo,
} from "components";
import { TripItem } from "components/MainMenu/TripItem";
import { FC } from "react";
import {
  paginateTripsSearch,
  selectSelectedLiveVessel,
  selectTrips,
  selectTripsLoading,
  selectTripsSearch,
  selectVesselByFiskeridirId,
  useAppDispatch,
  useAppSelector,
} from "store";

export const LiveAisMenu: FC = () => {
  const dispatch = useAppDispatch();

  const position = useAppSelector(selectSelectedLiveVessel)!;
  const vessel = useAppSelector((state) =>
    selectVesselByFiskeridirId(state, position.vesselId),
  )!;
  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const tripsSearch = useAppSelector(selectTripsSearch);

  const offset = tripsSearch?.offset ?? 0;
  const limit = tripsSearch?.limit ?? 10;

  const handleTripsPagination = (offset: number, limit: number) => {
    dispatch(paginateTripsSearch({ offset, limit }));
  };

  if (!position) {
    return <></>;
  }

  return (
    <>
      <VesselInfo vessel={vessel} />
      <List sx={{ color: "white", pt: 0 }}>
        <ListSubheader
          sx={{
            bgcolor: "primary.light",
            pl: 2.5,
          }}
        >
          Leveranser
        </ListSubheader>

        {tripsLoading ? (
          <Box sx={{ pt: 2, pl: 2.5 }}>
            <LocalLoadingProgress />
          </Box>
        ) : !trips?.length && offset === 0 ? (
          <Box sx={{ py: 1, pl: 2.5 }}>Ingen leveranser</Box>
        ) : (
          <>
            {trips?.map((t) => <TripItem key={t.tripId} trip={t} />)}

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
    </>
  );
};
