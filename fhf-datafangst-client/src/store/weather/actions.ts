import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getWeather = createAsyncThunk(
  "weather/getWeather",
  Api.getWeather,
);

export const setWeatherSearch = createAction<Api.WeatherArgs>(
  "weather/setWeatherSearch",
);
