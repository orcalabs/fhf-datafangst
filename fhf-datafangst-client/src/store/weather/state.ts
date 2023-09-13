import { WeatherArgs } from "api";
import { Weather } from "generated/openapi";

export interface WeatherState {
  weather?: Weather[];
  weatherLoading: boolean;
  weatherSearch?: WeatherArgs;
}

export const initialWeatherState: WeatherState = {
  weather: undefined,
  weatherLoading: false,
  weatherSearch: undefined,
};
