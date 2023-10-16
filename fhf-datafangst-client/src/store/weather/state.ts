import { WeatherArgs } from "api";
import { Weather, WeatherFeature } from "generated/openapi";

export interface WeatherState {
  weather?: Weather[];
  weatherLoading: boolean;
  weatherSearch?: WeatherArgs;
  selectedWeatherFeature: WeatherFeature;
}

export const initialWeatherState: WeatherState = {
  weather: undefined,
  weatherLoading: false,
  weatherSearch: undefined,
  selectedWeatherFeature: WeatherFeature.AirTemperature2m,
};
