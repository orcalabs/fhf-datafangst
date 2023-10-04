import { WeatherArgs } from "api";
import { Weather, WeatherFft } from "generated/openapi";

export enum WeatherFeature {
  AirTemperature2m,
  WindSpeed10m,
  RelativeHumidity2m,
  AirPressureAtSeaLevel,
  PrecipitationAmount,
}

export interface WeatherState {
  weather?: Weather[];
  weatherLoading: boolean;
  weatherSearch?: WeatherArgs;
  weatherFft?: WeatherFft[];
  selectedWeatherFeature: WeatherFeature;
  selectedWeatherLocation?: number;
}

export const initialWeatherState: WeatherState = {
  weather: undefined,
  weatherLoading: false,
  weatherSearch: undefined,
  weatherFft: undefined,
  selectedWeatherFeature: WeatherFeature.AirTemperature2m,
  selectedWeatherLocation: undefined,
};
