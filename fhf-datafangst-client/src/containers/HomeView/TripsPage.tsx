import {
  SelectedTripMenu,
  TripDetails,
  TripsLayer,
  TripsList,
} from "components";
import { PageLayoutCenter, PageLayoutLeft, PageLayoutRight } from "containers";
import { FC } from "react";
import {
  selectSelectedTrip,
  selectTripDetailsOpen,
  useAppSelector,
} from "store";

export const TripsPage: FC = () => {
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);

  return (
    <>
      <PageLayoutLeft>
        <TripsList />
      </PageLayoutLeft>
      <PageLayoutCenter open={tripDetailsOpen} sx={{ zIndex: 1000 }}>
        <TripDetails />
      </PageLayoutCenter>
      <PageLayoutRight open={!!selectedTrip}>
        <SelectedTripMenu />
      </PageLayoutRight>
      {selectedTrip && <TripsLayer />}
    </>
  );
};
