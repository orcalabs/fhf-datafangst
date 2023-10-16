import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectWeather = createSelector(
  selectAppState,
  (state) => state.weather,
);

export const selectWeatherSearch = createSelector(
  selectAppState,
  (state) => state.weatherSearch,
);

export const selectWeatherLoading = createSelector(
  selectAppState,
  (state) => state.weatherLoading,
);

export const selectSelectedWeatherFeature = createSelector(
  selectAppState,
  (state) => state.selectedWeatherFeature,
);
