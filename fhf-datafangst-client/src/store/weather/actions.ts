import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { WeatherFeature } from "generated/openapi";

export const getWeather = createAsyncThunk(
  "weather/getWeather",
  Api.getWeather,
);

export const setWeatherSearch = createAction<Api.WeatherArgs>(
  "weather/setWeatherSearch",
);

export const setSelectedWeatherFeature = createAction<WeatherFeature>(
  "weather/setSelectedWeatherFeature",
);
