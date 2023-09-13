import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getWeather, setWeatherSearch } from ".";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getWeather.pending, (state, _) => {
      state.weather = undefined;
      state.weatherLoading = true;
    })
    .addCase(getWeather.fulfilled, (state, action) => {
      state.weather = action.payload;
      state.weatherLoading = false;
    })
    .addCase(getWeather.rejected, (state, _) => {
      state.weatherLoading = false;
    })
    .addCase(setWeatherSearch, (state, action) => {
      (action as any).asyncDispatch(getWeather(action.payload));

      return {
        ...state,
        weatherSearch: action.payload,
      };
    });
