import { Box, List, ListSubheader } from "@mui/material";
import { TripsArgs } from "api";
import {
  LocalLoadingProgress,
  PaginationButtons,
  SearchFilters,
} from "components";
import { AppPage } from "containers/App/App";
import { FC, useEffect, useMemo } from "react";
import {
  paginateTripsSearch,
  selectAppPage,
  selectLoggedInVessel,
  selectTrips,
  selectTripsLoading,
  selectTripsSearch,
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

export const TripsList: FC = () => {
  const dispatch = useAppDispatch();

  const tripsLoading = useAppSelector(selectTripsLoading);
  const trips = useAppSelector(selectTrips);
  const tripsSearch = useAppSelector(selectTripsSearch);
  const vessel = useAppSelector(selectLoggedInVessel);
  const appPage = useAppSelector(selectAppPage);

  const offset = tripsSearch?.offset ?? 0;
  const limit = tripsSearch?.limit ?? 10;

  const activeFilterParams = useMemo(
    () =>
      appPage === AppPage.MyPage
        ? {
            ...withoutKeys(filterParams, "vessels", "vesselLengthGroups"),
            ...withoutKeys(tripsSearch, "vessels"),
          }
        : { ...filterParams, ...tripsSearch },
    [tripsSearch, filterParams, appPage],
  );
  const handleTripsPagination = (offset: number, limit: number) => {
    dispatch(paginateTripsSearch({ offset, limit }));
  };

  useEffect(() => {
    if (vessel && appPage === AppPage.MyPage) {
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
          bgcolor: "primary.light",
          pl: 2.5,
          pr: 0,
          pt: appPage === AppPage.MyPage ? 0 : 1,
          lineHeight: appPage === AppPage.MyPage ? "40px" : "48px",
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
          {trips?.map((t) => <TripItem key={t.tripId} trip={t} />)}

          <Box sx={{ mt: 1, mr: appPage === AppPage.MyPage ? 2 : 0 }}>
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
