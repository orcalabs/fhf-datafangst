import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1weatherApi } from "generated/openapi";

export interface WeatherArgs {
  startDate?: string;
  endDate?: string;
  weatherLocationIds?: string[];
}

const api = new V1weatherApi(apiConfiguration, undefined, axiosInstance);

export const getWeather = async (query: WeatherArgs) =>
  apiGet(async () =>
    api.weather({
      startDate: query.startDate,
      endDate: query.endDate,
      weatherLocationIds: query.weatherLocationIds?.join(","),
    }),
  );
