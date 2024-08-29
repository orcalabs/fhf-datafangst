import { V1weatherApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface WeatherArgs {
  startDate?: string;
  endDate?: string;
  weatherLocationIds: number[];
}

const api = new V1weatherApi(apiConfiguration, undefined, axiosInstance);

export const getWeather = async (query: WeatherArgs) =>
  apiGet(async () =>
    api.weather({
      startDate: query.startDate,
      endDate: query.endDate,
      weatherLocationIds: query.weatherLocationIds,
    }),
  );
