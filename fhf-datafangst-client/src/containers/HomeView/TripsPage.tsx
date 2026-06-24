import type { FC } from "react";
import {
  SelectedHaulMenu,
  SelectedTripMenu,
  TripDetails,
  TripsLayer,
  TripsList,
} from "~/components";
import { HaulsSlider } from "~/components/HaulsSlider/HaulsSlider";
import {
  PageLayoutCenter,
  PageLayoutCenterBottom,
  PageLayoutLeft,
  PageLayoutRight,
} from "~/containers";
import {
  selectSelectedTrip,
  selectSelectedTripHaul,
  selectTripDetailsOpen,
  useAppSelector,
} from "~/store";

export const TripsPage: FC = () => {
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const selectedTripHaul = useAppSelector(selectSelectedTripHaul);
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);

  return (
    <>
      <PageLayoutLeft>
        <TripsList />
      </PageLayoutLeft>
      <PageLayoutCenter open={tripDetailsOpen} sx={{ zIndex: 1000 }}>
        <TripDetails />
      </PageLayoutCenter>
      <PageLayoutRight open={!!selectedTrip || !!selectedTripHaul}>
        {selectedTrip && <SelectedTripMenu />}
      </PageLayoutRight>
      <PageLayoutRight open={!!selectedTripHaul}>
        {selectedTripHaul && <SelectedHaulMenu />}
      </PageLayoutRight>
      {selectedTrip && <TripsLayer />}
      <PageLayoutCenterBottom open={!!selectedTrip?.hauls.length}>
        <HaulsSlider />
      </PageLayoutCenterBottom>
    </>
  );
};
