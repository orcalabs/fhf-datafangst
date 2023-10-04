import { FC } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import theme from "app/theme";
import {
  selectSelectedWeatherFeature,
  useAppSelector,
  WeatherFeature,
} from "store";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import { weatherLocationFeaturesMap } from "utils";

interface Props {
  location: number;
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

export const WeatherPopover: FC<Props> = ({ location }) => {
  const weatherFeature = useAppSelector(selectSelectedWeatherFeature);
  const locationFeature = weatherLocationFeaturesMap[location];

  const Icon = featureToIcon(weatherFeature);

  return (
    <Box sx={{ px: 1 }}>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemIcon sx={{ minWidth: 0, pr: 1.5 }}>
            <Icon fill={theme.palette.primary.main} width="36" height="36" />
          </ListItemIcon>
          <ListItemText primary={locationFeature.get("value").toFixed(1)} />
        </ListItem>
      </List>
    </Box>
  );
};
