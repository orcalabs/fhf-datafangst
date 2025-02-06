import { Box, List, ListSubheader } from "@mui/material";
import { TripsArgs } from "api";
import {
  LocalLoadingProgress,
  PaginationButtons,
  SearchFilters,
} from "components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC, useEffect } from "react";
import {
  MenuViewState,
  paginateTripsSearch,
  selectLoggedInVessel,
  selectTrips,
  selectTripsLoading,
  selectTripsSearch,
  selectViewState,
  setTripsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { withoutKeys } from "utils";
import { TripItem } from "./TripItem";

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
  const tripsSearch = useAppSelector(selectTripsSearch);
  const vessel = useAppSelector(selectLoggedInVessel);
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

  useEffect(() => {
    if (vessel && viewState === MenuViewState.MyPage) {
      dispatch(setTripsSearch({ ...tripsSearch, vessels: [vessel] }));
    } else {
      dispatch(setTripsSearch({ ...tripsSearch }));
    }
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent
        className="overlayscrollbars-react"
        options={{ scrollbars: { theme: "os-theme-light" } }}
        defer
        style={{ height: "100%" }}
      >
        <List sx={{ color: "white", pt: 0 }}>
          <ListSubheader
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "primary.light",
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
                dispatch(
                  setTripsSearch({ ...tripsSearch, ...value, offset: 0 }),
                )
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
            <>{trips?.map((t) => <TripItem key={t.tripId} trip={t} />)}</>
          )}
        </List>
      </OverlayScrollbarsComponent>
      <Box
        sx={{
          py: 1.5,
          mr: viewState === MenuViewState.MyPage ? 2 : 0,
        }}
      >
        <PaginationButtons
          numItems={trips?.length ?? 0}
          offset={offset}
          limit={limit}
          onPaginationChange={handleTripsPagination}
        />
      </Box>
    </>
  );
};
