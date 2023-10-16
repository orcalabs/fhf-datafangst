import { FC, useMemo } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import theme from "app/theme";
import {
  selectFishmap,
  selectSelectedWeatherFeature,
  selectWeather,
  useAppSelector,
} from "store";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import { Weather, WeatherFeature } from "generated/openapi";
import { Pixel } from "ol/pixel";
import { toLonLat } from "ol/proj";

interface Props {
  pixel: Pixel;
}

const featureToIcon = (f: WeatherFeature) => {
  switch (f) {
    case WeatherFeature.AirTemperature2m:
      return ThermostatIcon;
    case WeatherFeature.WindSpeed10m:
      return AirIcon;
    case WeatherFeature.RelativeHumidity2m:
      return WaterDropIcon;
    case WeatherFeature.AirPressureAtSeaLevel:
      return SpeedIcon;
    case WeatherFeature.PrecipitationAmount:
      return FilterAltIcon;
  }
};

const featureToValue = (w: Weather | undefined, f: WeatherFeature) => {
  switch (f) {
    case WeatherFeature.AirTemperature2m:
      return w?.airTemperature2m ? w.airTemperature2m - 273.15 : undefined;
    case WeatherFeature.WindSpeed10m:
      return w?.windSpeed10m;
    case WeatherFeature.RelativeHumidity2m:
      return w?.relativeHumidity2m ? w?.relativeHumidity2m * 100 : undefined;
    case WeatherFeature.AirPressureAtSeaLevel:
      return w?.airPressureAtSeaLevel
        ? w?.airPressureAtSeaLevel / 100
        : undefined;
    case WeatherFeature.PrecipitationAmount:
      return w?.precipitationAmount;
  }
};

export const WeatherPopover: FC<Props> = ({ pixel }) => {
  const fishmap = useAppSelector(selectFishmap);
  const weather = useAppSelector(selectWeather);
  const feature = useAppSelector(selectSelectedWeatherFeature);

  const [latitude, longitude] = useMemo(() => {
    const coord = fishmap.getCoordinateFromPixel(pixel);
    const [longitude, latitude] = toLonLat(coord);
    return [latitude, longitude];
  }, [fishmap, pixel]);

  const value = useMemo(() => {
    const id =
      (Math.floor(latitude * 10) + 1000) * 100_000 +
      (Math.floor(longitude * 10) + 1000);
    const w = weather?.find((v) => v.weatherLocationId === id);
    return featureToValue(w, feature);
  }, [feature, weather, latitude, longitude]);

  if (value === undefined || value === null) {
    return <></>;
  }

  const Icon = featureToIcon(feature);

  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <Icon fill={theme.palette.primary.main} width="36" height="36" />
          </ListItemIcon>
          <ListItemText primary={value.toFixed(1)} />
        </ListItem>
      </List>
    </Box>
  );
};
