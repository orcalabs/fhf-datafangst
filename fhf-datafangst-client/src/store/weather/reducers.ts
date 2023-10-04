import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  getWeather,
  getWeatherFft,
  setSelectedWeatherFeature,
  setSelectedWeatherLocation,
  setWeatherSearch,
} from ".";

export const weatherBuilder = (
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
    .addCase(getWeatherFft.pending, (state, _) => {
      state.weatherFft = undefined;
    })
    .addCase(getWeatherFft.fulfilled, (state, action) => {
      state.weatherFft = action.payload;
    })
    .addCase(setWeatherSearch, (state, action) => {
      (action as any).asyncDispatch(getWeather(action.payload));

      return {
        ...state,
        weatherSearch: action.payload,
      };
    })
    .addCase(setSelectedWeatherFeature, (state, action) => {
      state.selectedWeatherFeature = action.payload;
    })
    .addCase(setSelectedWeatherLocation, (state, action) => {
      state.selectedWeatherLocation = action.payload;
    });
