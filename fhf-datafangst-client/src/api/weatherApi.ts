import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1weatherApi } from "generated/openapi";

export interface WeatherArgs {
  startDate?: string;
  endDate?: string;
  weatherLocationIds?: string[];
}

export interface WeatherFftArgs {
  startDate: string;
  endDate: string;
}

const api = new V1weatherApi(apiConfiguration, undefined, axiosInstance);

export const getWeather = async (query: WeatherArgs) =>
  apiGet(async () =>
    api.weatherAvg({
      startDate: query.startDate,
      endDate: query.endDate,
      weatherLocationIds: query.weatherLocationIds?.join(","),
    }),
  );

export const getWeatherLocations = async () =>
  apiGet(async () => api.weatherLocations());

export const getWeatherFft = async (query: WeatherFftArgs) =>
  apiGet(async () => api.weatherFft(query));
