import { Stack } from "@mui/system";
import {
  DeliveryPointsLayer,
  Header,
  Map,
  MapAttributions,
  MapControls,
  MapFilters,
  SeamapLayer,
  ShorelineLayer,
} from "components";
import { SearchBar } from "components/SearchBar/SearchBar";
import { AppPage } from "containers/App/App";
import { AreaPage } from "containers/HomeView/AreaPage";
import { LivePage } from "containers/HomeView/LivePage";
import { MyPage } from "containers/HomeView/MyPage";
import { TripsPage } from "containers/HomeView/TripsPage";
import { PageLayout } from "containers/PageLayout/PageLayout";
import {
  PageLayoutCenter,
  PageLayoutCenterFull,
} from "containers/PageLayout/PageLayoutCenter";
import { PageLayoutHeader } from "containers/PageLayout/PageLayoutHeader";
import { FC, useEffect, useState } from "react";
import {
  selectAppPage,
  setAppPage,
  useAppDispatch,
  useAppSelector,
} from "store";

export interface MapFilter {
  coastline: boolean;
  seamap: boolean;
  deliveryPoints: boolean;
  [key: string]: boolean;
}

const initialMapFilter: MapFilter = {
  coastline: false,
  seamap: false,
  deliveryPoints: false,
};

export interface Props {
  page: AppPage;
}

export const HomeView: FC<Props> = ({ page }) => {
  const dispatch = useAppDispatch();

  const pageState = useAppSelector(selectAppPage);

  const [mapFilter, setMapFilter] = useState<MapFilter>(initialMapFilter);

  useEffect(() => {
    dispatch(setAppPage(page));
  }, [page]);

  return (
    <PageLayout>
      <PageLayoutHeader>
        <Header page={page} />
      </PageLayoutHeader>

      {
        // Need to wait for the state to reflect the page change because it also resets the state,
        // so if we don't wait the new page will initialize with a dirty state.
        page === pageState && (
          <>
            {page === AppPage.Live && <LivePage />}
            {page === AppPage.Area && <AreaPage />}
            {page === AppPage.Trips && <TripsPage />}
            {page === AppPage.MyPage && <MyPage />}
          </>
        )
      }

      <PageLayoutCenterFull>
        <Map></Map>
      </PageLayoutCenterFull>
      <PageLayoutCenter sx={{ placeContent: "end", pointerEvents: "none" }}>
        <Stack direction="row" justifyContent="space-between">
          <MapControls />
          <MapAttributions />
        </Stack>
      </PageLayoutCenter>
      <PageLayoutCenter
        sx={{
          display: "grid",
          placeContent: "start end",
        }}
      >
        <Stack direction="row">
          {page === AppPage.Live && <SearchBar />}
          <MapFilters mapFilter={mapFilter} onFilterChange={setMapFilter} />
        </Stack>
        {mapFilter.coastline && <ShorelineLayer />}
        {mapFilter.seamap && <SeamapLayer />}
        {mapFilter.deliveryPoints && <DeliveryPointsLayer />}
      </PageLayoutCenter>
    </PageLayout>
  );
};
