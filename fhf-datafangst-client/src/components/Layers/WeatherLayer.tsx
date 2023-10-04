import { FC, useCallback, useEffect, useState } from "react";
import {
  getWeatherFft,
  selectFishmap,
  selectSelectedWeatherFeature,
  selectWeather,
  selectWeatherFft,
  setSelectedWeatherFeature,
  useAppDispatch,
  useAppSelector,
  WeatherFeature,
} from "store";
import LayersIcon from "@mui/icons-material/Layers";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VectorSource from "ol/source/Vector";
import SpeedIcon from "@mui/icons-material/Speed";
import { Layer } from "ol/layer";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer.js";
import { Box } from "@mui/system";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { Options } from "ol/layer/Layer";
import { SimpleGeometry } from "ol/geom";
import {
  weatherLocationFeaturesMap,
  rifft,
  weatherLocationFeatures,
} from "utils";

const CToK = (c: number): number => c + 273.15;

//   min_temperature  |  max_temperature
// -------------------+-------------------
//  236.5880600000000 | 312.9568800000000
class WebGLTemperatureLayer extends Layer {
  createRenderer(): WebGLVectorLayerRenderer {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          CToK(-10),
          "#0000ff",
          CToK(25),
          "#ff0000",
        ],
      },
    });
  }
}
//        min_wind        |     max_wind
// -----------------------+-------------------
//  0.0002818679982123650 | 40.93453940980498
class WebGLWindLayer extends Layer {
  createRenderer(): WebGLVectorLayerRenderer {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          "#0000ff",
          15,
          "#ff0000",
        ],
      },
    });
  }
}
//     min_humidity    |   max_humidity
// --------------------+-------------------
//  0.1186266400000000 | 1.000007600000000
class WebGLHumidityLayer extends Layer {
  createRenderer(): WebGLVectorLayerRenderer {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          "#ff0000",
          0.5,
          "#aaff00",
          1,
          "#0000ff",
        ],
      },
    });
  }
}
//    min_pressure    |   max_pressure
// -------------------+-------------------
//  93870.55000000000 | 105533.8050000000
class WebGLAirPressureLayer extends Layer {
  createRenderer(): WebGLVectorLayerRenderer {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          98925,
          "#0000ff",
          102322,
          "#ff0000",
        ],
      },
    });
  }
}
//  max_precipitation
// -------------------
//  1290.178800000000
class WebGLPrecipitationLayer extends Layer {
  createRenderer(): WebGLVectorLayerRenderer {
    return new WebGLVectorLayerRenderer(this, {
      postProcesses: [{ scaleRatio: 0.5 }],
      style: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "value"],
          0,
          ["color", 0, 0, 255, 0],
          6,
          ["color", 0, 0, 255, 1],
        ],
      },
    });
  }
}
WebGLVectorLayerRenderer.prototype.forEachFeatureAtCoordinate = function (
  coordinate,
  _frameState,
  _hitTolerance,
  callback,
  _matches,
) {
  console.log("here");
  const f = weatherLocationFeatures.find(
    (w) => w.getGeometry()?.intersectsCoordinate(coordinate),
  );
  if (f) {
    return callback(f, this.getLayer(), f.getGeometry()! as SimpleGeometry);
  }
  return undefined;
};

const activeStyle = {
  bgcolor: "primary.main",
  "& .MuiSpeedDialAction-fab": {
    color: "white",
    bgcolor: "primary.main",
  },
  svg: { color: "white" },
  "&:hover": { bgcolor: "primary.dark" },
} as const;

const featureToLayer = (feature: WeatherFeature, options: Options) => {
  switch (feature) {
    case WeatherFeature.AirTemperature2m:
      return new WebGLTemperatureLayer(options);
    case WeatherFeature.WindSpeed10m:
      return new WebGLWindLayer(options);
    case WeatherFeature.RelativeHumidity2m:
      return new WebGLHumidityLayer(options);
    case WeatherFeature.AirPressureAtSeaLevel:
      return new WebGLAirPressureLayer(options);
    case WeatherFeature.PrecipitationAmount:
      return new WebGLPrecipitationLayer(options);
  }
};
const featureToProperty = (feature: WeatherFeature) => {
  switch (feature) {
    case WeatherFeature.AirTemperature2m:
      return "airTemperature2m";
    case WeatherFeature.WindSpeed10m:
      return "windSpeed10m";
    case WeatherFeature.RelativeHumidity2m:
      return "relativeHumidity2m";
    case WeatherFeature.AirPressureAtSeaLevel:
      return "airPressureAtSeaLevel";
    case WeatherFeature.PrecipitationAmount:
      return "precipitationAmount";
  }
};

const latMin = 523;
const latMax = 738;
const lonMin = -118;
const lonMax = 417;

const latsLons = new Array(49_060);

for (let i = 0, lat = latMin; lat <= latMax; lat++) {
  if (lat % 2 === 0) {
    for (let lon = lonMin; lon <= lonMax; lon++) {
      const id = (lat + 1000) * 100_000 + (lon + 1000);
      if (id in weatherLocationFeaturesMap) {
        latsLons[i++] = id;
      }
    }
  } else {
    for (let lon = lonMax; lon >= lonMin; lon--) {
      const id = (lat + 1000) * 100_000 + (lon + 1000);
      if (id in weatherLocationFeaturesMap) {
        latsLons[i++] = id;
      }
    }
  }
}

export const WeatherLayer: FC = () => {
  const dispatch = useAppDispatch();

  const fishmap = useAppSelector(selectFishmap);

  const feature = useAppSelector(selectSelectedWeatherFeature);
  const weather = useAppSelector(selectWeather);
  const weatherFft = useAppSelector(selectWeatherFft);

  const [fft, setFft] = useState(true);

  useEffect(() => {
    // dispatch(
    //   getWeather({
    //     // startDate: "2019-06-20T08:00:00Z",
    //     // endDate: "2019-06-20T08:00:00Z",
    //     startDate: "2023-10-01T10:00:00Z",
    //     endDate: "2023-10-01T10:00:00Z",
    //   }),
    // );
    dispatch(
      getWeatherFft({
        // timestamp: "2019-06-20T08:00:00Z",
        startDate: "2023-9-01T00:00:00Z",
        endDate: "2023-10-01T00:00:00Z",
      }),
    );
  }, []);

  const removeLayer = useCallback(() => {
    for (const layer of fishmap.getLayers().getArray()) {
      if (layer.get("name") === "WeatherLayer") {
        fishmap.removeLayer(layer);
        layer.dispose();
        return;
      }
    }
  }, [fishmap]);

  useEffect(() => {
    const useEffect_ = async () => {
      if (!weatherFft) {
        // if (!weather?.length || !weatherFft) {
        // removeLayer();
        return;
      }

      const prop = featureToProperty(feature);

      console.log(weatherFft.length);
      const start = performance.now();
      const temp = await rifft(weatherFft[0][prop]);
      const end = performance.now();
      console.log(end - start);

      if (fft) {
        for (let i = 0; i < weatherLocationFeatures.length; i++) {
          const id = latsLons[i];
          const f = weatherLocationFeaturesMap[id];
          f.setProperties({ value: temp[i] });
        }
      } else if (weather) {
        for (let i = 0; i < weatherLocationFeatures.length; i++) {
          const id = weather[i].weatherLocationId;
          const f = weatherLocationFeaturesMap[id];
          f.setProperties({ value: weather[i][prop] });
        }
      }

      const layer = featureToLayer(feature, {
        source: new VectorSource({ features: weatherLocationFeatures }),
        properties: { name: "WeatherLayer", disableHitDetection: true },
        zIndex: 100,
      });

      fishmap.addLayer(layer);
      console.log(fishmap.getLayers().getArray());
    };

    useEffect_();

    return () => {
      removeLayer();
    };
  }, [fishmap, removeLayer, feature, weather, weatherFft, fft]);

  const handleChange = (f: WeatherFeature, ft: boolean) => {
    dispatch(setSelectedWeatherFeature(f));
    setFft(ft);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "8.5rem",
          right: "5rem",
          pointerEvents: "none",
          height: 56,
          zIndex: 1000,
        }}
      >
        <SpeedDial
          ariaLabel="WeatherModes"
          direction={"down"}
          sx={{
            "& .MuiFab-primary": {
              borderRadius: 0,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
                svg: { bgcolor: "primary.dark" },
              },
            },
            "& .MuiFab-root": { borderRadius: 0 },
          }}
          icon={<LayersIcon />}
        >
          <SpeedDialAction
            sx={
              fft && feature === WeatherFeature.AirTemperature2m
                ? activeStyle
                : {}
            }
            onClick={() => handleChange(WeatherFeature.AirTemperature2m, true)}
            icon={<ThermostatIcon />}
            tooltipTitle={"Temperatur"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              fft && feature === WeatherFeature.WindSpeed10m ? activeStyle : {}
            }
            onClick={() => handleChange(WeatherFeature.WindSpeed10m, true)}
            icon={<AirIcon />}
            tooltipTitle={"Vind"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              fft && feature === WeatherFeature.RelativeHumidity2m
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.RelativeHumidity2m, true)
            }
            icon={<WaterDropIcon />}
            tooltipTitle={"Fuktighet"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              fft && feature === WeatherFeature.AirPressureAtSeaLevel
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.AirPressureAtSeaLevel, true)
            }
            icon={<SpeedIcon />}
            tooltipTitle={"Lufttrykk"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              fft && feature === WeatherFeature.PrecipitationAmount
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.PrecipitationAmount, true)
            }
            icon={<FilterAltIcon />}
            tooltipTitle={"Nedbør"}
            tooltipPlacement="left"
          />
        </SpeedDial>
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: "8.5rem",
          right: "1rem",
          pointerEvents: "none",
          height: 56,
          zIndex: 1000,
        }}
      >
        <SpeedDial
          ariaLabel="WeatherModes"
          direction={"down"}
          sx={{
            "& .MuiFab-primary": {
              borderRadius: 0,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
                svg: { bgcolor: "primary.dark" },
              },
            },
            "& .MuiFab-root": { borderRadius: 0 },
          }}
          icon={<LayersIcon />}
        >
          <SpeedDialAction
            sx={
              !fft && feature === WeatherFeature.AirTemperature2m
                ? activeStyle
                : {}
            }
            onClick={() => handleChange(WeatherFeature.AirTemperature2m, false)}
            icon={<ThermostatIcon />}
            tooltipTitle={"Temperatur"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              !fft && feature === WeatherFeature.WindSpeed10m ? activeStyle : {}
            }
            onClick={() => handleChange(WeatherFeature.WindSpeed10m, false)}
            icon={<AirIcon />}
            tooltipTitle={"Vind"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              !fft && feature === WeatherFeature.RelativeHumidity2m
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.RelativeHumidity2m, false)
            }
            icon={<WaterDropIcon />}
            tooltipTitle={"Fuktighet"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              !fft && feature === WeatherFeature.AirPressureAtSeaLevel
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.AirPressureAtSeaLevel, false)
            }
            icon={<SpeedIcon />}
            tooltipTitle={"Lufttrykk"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              !fft && feature === WeatherFeature.PrecipitationAmount
                ? activeStyle
                : {}
            }
            onClick={() =>
              handleChange(WeatherFeature.PrecipitationAmount, false)
            }
            icon={<FilterAltIcon />}
            tooltipTitle={"Nedbør"}
            tooltipPlacement="left"
          />
        </SpeedDial>
      </Box>
    </>
  );
};
