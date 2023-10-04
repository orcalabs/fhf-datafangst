import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { WeatherFeature } from "./state";

export const getWeather = createAsyncThunk(
  "weather/getWeather",
  Api.getWeather,
);

export const getWeatherFft = createAsyncThunk(
  "weather/getWeatherFft",
  Api.getWeatherFft,
);

export const setWeatherSearch = createAction<Api.WeatherArgs>(
  "weather/setWeatherSearch",
);

export const setSelectedWeatherFeature = createAction<WeatherFeature>(
  "weather/setSelectedWeatherFeature",
);

export const setSelectedWeatherLocation = createAction<number | undefined>(
  "weather/setSelectedWeatherLocation",
);
