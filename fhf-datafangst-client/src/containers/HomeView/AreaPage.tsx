import { HaulsFilter, LandingsFilter } from "api";
import {
  HaulsLayer,
  HaulsMenu,
  LandingsMenu,
  LocationsGrid,
  MatrixMenu,
  SelectedTripMenu,
  TimeSlider,
  TrackLayer,
  TripsLayer,
} from "components";
import { PageLayoutLeft, PageLayoutRight } from "containers";
import { PageLayoutCenterBottom } from "containers/PageLayout/PageLayoutCenter";
import { MatrixTab, useMatrixTab } from "hooks";
import { FC } from "react";
import {
  selectHaulsMatrixSearch,
  selectLandingsMatrixSearch,
  selectSelectedGridsString,
  selectSelectedHaul,
  selectSelectedTrip,
  setHaulDateSliderFrame,
  setHaulsMatrixSearch,
  setLandingDateSliderFrame,
  setLandingsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { MinErsYear, MinLandingYear } from "utils";

export const AreaPage: FC = () => {
  const dispatch = useAppDispatch();

  const selectedTrip = useAppSelector(selectSelectedTrip);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const landingsSearch = useAppSelector(selectLandingsMatrixSearch);
  const selectedHaul = useAppSelector(selectSelectedHaul);

  const [matrixTab, _] = useMatrixTab();

  return (
    <>
      <PageLayoutLeft>
        <MatrixMenu />
      </PageLayoutLeft>
      <PageLayoutCenterBottom
        open={!selectedTrip && selectedGrids.length === 0}
      >
        {matrixTab === MatrixTab.Ers ? (
          <TimeSlider
            options={haulsSearch}
            minYear={MinErsYear}
            onValueChange={(date: Date) =>
              dispatch(setHaulDateSliderFrame(date))
            }
            onOpenChange={(open: boolean) => {
              dispatch(
                open
                  ? setHaulsMatrixSearch({
                      ...haulsSearch,
                      filter: HaulsFilter.Date,
                    })
                  : setHaulDateSliderFrame(undefined),
              );
            }}
          />
        ) : (
          <TimeSlider
            options={landingsSearch}
            minYear={MinLandingYear}
            onValueChange={(date: Date) =>
              dispatch(setLandingDateSliderFrame(date))
            }
            onOpenChange={(open: boolean) => {
              dispatch(
                open
                  ? setLandingsMatrixSearch({
                      ...landingsSearch,
                      filter: LandingsFilter.Date,
                    })
                  : setLandingDateSliderFrame(undefined),
              );
            }}
          />
        )}
      </PageLayoutCenterBottom>
      <PageLayoutRight open={!!selectedTrip || selectedGrids.length > 0}>
        {selectedTrip ? (
          <SelectedTripMenu />
        ) : matrixTab === MatrixTab.Ers ? (
          <HaulsMenu />
        ) : (
          <LandingsMenu />
        )}
      </PageLayoutRight>
      {selectedTrip ? (
        <TripsLayer />
      ) : (
        <>
          {!!selectedHaul && <TrackLayer />}
          {selectedGrids.length > 0 && <HaulsLayer />}
          <LocationsGrid />
        </>
      )}
    </>
  );
};
