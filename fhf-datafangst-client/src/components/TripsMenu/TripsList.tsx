import { Box, List, ListSubheader, Typography } from "@mui/material";
import { TripsArgs } from "api";
import {
  LocalLoadingProgress,
  OverlayScrollbars,
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
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        color: "white",
        pt: 0,
        overflowY: "hidden",
      }}
    >
      <ListSubheader
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "inherit",
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
        <Box sx={{ py: 3 }}>
          <LocalLoadingProgress />
        </Box>
      ) : !trips?.length && offset === 0 ? (
        <Typography sx={{ py: 2, pl: 3.5, fontStyle: "italic" }}>
          Ingen resultater
        </Typography>
      ) : (
        <>
          <OverlayScrollbars style={{ flexGrow: 1 }}>
            {trips?.map((t) => <TripItem key={t.tripId} trip={t} />)}
          </OverlayScrollbars>

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
