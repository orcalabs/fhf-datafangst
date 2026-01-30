import { WeatherApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface WeatherArgs {
  startDate?: string;
  endDate?: string;
  weatherLocationIds: number[];
}

const api = new WeatherApi(apiConfiguration, undefined, axiosInstance);

export const getWeather = apiFn((query: WeatherArgs, signal) =>
  api.routesV1WeatherWeather(
    {
      start: query.startDate,
      end: query.endDate,
      weatherLocationIds: query.weatherLocationIds,
    },
    { signal },
  ),
);
