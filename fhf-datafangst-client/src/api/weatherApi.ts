import { WeatherApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface WeatherArgs {
  startDate?: string;
  endDate?: string;
  weatherLocationIds: number[];
}

const api = new WeatherApi(apiConfiguration, undefined, axiosInstance);

export const getWeather = async (query: WeatherArgs) =>
  apiGet(async () =>
    api.routesV1WeatherWeather({
      startDate: query.startDate,
      endDate: query.endDate,
      weatherLocationIds: query.weatherLocationIds,
    }),
  );
