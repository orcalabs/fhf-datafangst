import type { WeatherArgs } from "~/api";
import type { Weather } from "~/generated/openapi";

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
