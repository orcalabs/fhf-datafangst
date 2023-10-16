import { FC, useEffect, useMemo, useState } from "react";
import {
  getWeather,
  selectFishmap,
  selectSelectedWeatherFeature,
  setSelectedWeatherFeature,
  useAppDispatch,
  useAppSelector,
} from "store";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic.js";
import {
  Box,
  Popover,
  Slider,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import { addHours, differenceInHours } from "date-fns";
import { CurrentTrip, Trip, WeatherFeature } from "generated/openapi";
import LayersIcon from "@mui/icons-material/Layers";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import { dateFormat } from "utils";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { unByKey } from "ol/Observable";
import { MapBrowserEvent } from "ol";
import { WeatherPopover } from "components/Map/WeatherPopover";
import { Pixel } from "ol/pixel";

const activeStyle = {
  bgcolor: "primary.main",
  "& .MuiSpeedDialAction-fab": {
    color: "white",
    bgcolor: "primary.main",
  },
  svg: { color: "white" },
  "&:hover": { bgcolor: "primary.dark" },
} as const;

const latMin = 52.3;
const latMax = 73.9;
const lonMin = -11.8;
const lonMax = 41.8;
const imageExtent = [lonMin, latMin, lonMax, latMax];

const createStatic = (timestamp: Date, feature: WeatherFeature) =>
  new Static({
    url: `${
      process.env.REACT_APP_API_URL as string
    }/v1.0/weather_image?timestamp=${timestamp.toISOString()}&feature=${
      feature as string
    }`,
    projection: "EPSG:4326",
    imageExtent,
  });

const featureToScale = (feature: WeatherFeature) => {
  switch (feature) {
    case WeatherFeature.WindSpeed10m:
      return {
        color:
          "linear-gradient(to right, #bea86d00 0%, #bea86dff, #a64c4c, #9f214a, #460e27 100%)",
        labels: ["m/s", "13", "26", "40"],
      };
    case WeatherFeature.AirTemperature2m:
      return {
        color:
          "linear-gradient(to right, #e5eeff 0%, #99b0d6, #284d7e, #277492, #bea86d, #a64c4c, #9f214a, #460e27 100%)",
        labels: ["°C", "-20", "0", "20", "40"],
      };
    case WeatherFeature.RelativeHumidity2m:
      return {
        color:
          "linear-gradient(to right, #f00101 0%, #c64111, #c08541, #76ccbe, #37aeaf, #3b9eaf, #1395a8, #3985ae, #394675 100%)",
        labels: ["%", "33", "66", "100"],
      };
    case WeatherFeature.AirPressureAtSeaLevel:
      return {
        color:
          "linear-gradient(to right, #012064 0%, #3499c2 62.555%, #d6d6d7 63.555%, #e0a551 64.555%, #973b35 100%)",
        labels: ["hPa", "980", "1020", "1056"],
      };
    case WeatherFeature.PrecipitationAmount:
      return {
        color:
          "linear-gradient(to right, #3985ae00 0%, #3985aeaa 0.5%, #394675, #012064 100%)",
        labels: ["mm", "400", "800", "1200"],
      };
  }
};

interface Props {
  trip: Trip | CurrentTrip;
}

export const WeatherLayer: FC<Props> = ({ trip }) => {
  const dispatch = useAppDispatch();

  const fishmap = useAppSelector(selectFishmap);
  const feature = useAppSelector(selectSelectedWeatherFeature);

  const d = new Date((trip as Trip)?.start ?? (trip as CurrentTrip).departure);
  const startDate = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDay(),
    d.getHours(),
    0,
    0,
  );

  const numHours = useMemo(
    () =>
      (trip as Trip).start
        ? differenceInHours(
            new Date((trip as Trip).end),
            new Date((trip as Trip).start),
          )
        : differenceInHours(
            new Date(),
            new Date((trip as CurrentTrip).departure),
          ),
    [startDate.getTime()],
  );

  const [playing, setPlaying] = useState(false);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [clickedPixel, setClickedPixel] = useState<Pixel | undefined>();

  const layer = useMemo(
    () =>
      new ImageLayer({
        source: createStatic(addHours(startDate, sliderIdx), feature),
        properties: { name: "WeatherLayer" },
      }),

    [],
  );

  useEffect(() => {
    fishmap.addLayer(layer);
    const key = fishmap.on("singleclick", (event: MapBrowserEvent<any>) => {
      if (event.dragging) {
        return;
      }
      setClickedPixel(event.pixel);
    });
    return () => {
      fishmap.removeLayer(layer);
      unByKey(key);
    };
  }, [fishmap, layer]);

  useEffect(() => {
    if (playing) {
      const id = setTimeout(
        () => setSliderIdx(sliderIdx >= numHours ? 0 : sliderIdx + 1),
        1500,
      );
      return () => clearTimeout(id);
    }
  }, [playing, sliderIdx]);

  useEffect(() => {
    const timestamp = addHours(startDate, sliderIdx);
    layer.setSource(createStatic(timestamp, feature));
    dispatch(
      getWeather({
        startDate: timestamp.toISOString(),
        endDate: timestamp.toISOString(),
      }),
    );
  }, [layer, startDate.getTime(), sliderIdx, feature]);

  useEffect(() => {
    const scale = document.getElementById("map-controls") as HTMLElement;
    scale.style.bottom = "70px";
    return () => {
      scale.style.bottom = "10px";
    };
  }, []);

  const valueLabelFormat = (idx: number) => {
    const d = addHours(startDate, idx);
    return dateFormat(d, "d MMM YYY HH:00");
  };

  const colorScale = featureToScale(feature);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: "4rem",
          right: 592,
          pointerEvents: "none",
          height: 56,
          width: 56,
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
            sx={feature === WeatherFeature.AirTemperature2m ? activeStyle : {}}
            onClick={() =>
              dispatch(
                setSelectedWeatherFeature(WeatherFeature.AirTemperature2m),
              )
            }
            icon={<ThermostatIcon />}
            tooltipTitle={"Temperatur"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={feature === WeatherFeature.WindSpeed10m ? activeStyle : {}}
            onClick={() =>
              dispatch(setSelectedWeatherFeature(WeatherFeature.WindSpeed10m))
            }
            icon={<AirIcon />}
            tooltipTitle={"Vind"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              feature === WeatherFeature.RelativeHumidity2m ? activeStyle : {}
            }
            onClick={() =>
              dispatch(
                setSelectedWeatherFeature(WeatherFeature.RelativeHumidity2m),
              )
            }
            icon={<WaterDropIcon />}
            tooltipTitle={"Fuktighet"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              feature === WeatherFeature.AirPressureAtSeaLevel
                ? activeStyle
                : {}
            }
            onClick={() =>
              dispatch(
                setSelectedWeatherFeature(WeatherFeature.AirPressureAtSeaLevel),
              )
            }
            icon={<SpeedIcon />}
            tooltipTitle={"Lufttrykk"}
            tooltipPlacement="left"
          />
          <SpeedDialAction
            sx={
              feature === WeatherFeature.PrecipitationAmount ? activeStyle : {}
            }
            onClick={() =>
              dispatch(
                setSelectedWeatherFeature(WeatherFeature.PrecipitationAmount),
              )
            }
            icon={<FilterAltIcon />}
            tooltipTitle={"Nedbør"}
            tooltipPlacement="left"
          />
        </SpeedDial>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: 516,
          bottom: 76,
          px: 2,
          width: 280,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: colorScale.color,
          "& span": {
            color: "white",
          },
        }}
      >
        {colorScale.labels.map((x, i) => (
          <span key={i}>{x}</span>
        ))}
      </Box>
      <Box
        sx={{
          position: "absolute",
          left: 500,
          right: 500,
          bottom: 0,
          display: "flex",
          zIndex: 99999,
          px: 4,
          height: 60,
          bgcolor: "rgba(238, 238, 238, 0.6)",
          alignItems: "center",
          "& .MuiSlider-root": { width: "100%", borderRadius: 0 },
          "& .MuiSlider-valueLabel": { bgcolor: "primary.light" },
          "& .MuiSlider-markLabel": { color: "black" },
          "& .MuiSlider-mark": {
            height: 15,
            bgcolor: "primary.light",
            opacity: "0.60",
          },
          "& .MuiSlider-markActive": {
            bgcolor: "primary.main",
            height: 15,
            opacity: "1",
          },
          "& .MuiSlider-thumb": {
            width: 17,
            height: 17,
            bgcolor: "primary.light",
            borderRadius: 0,
            opacity: 1,
          },
          "& .MuiSlider-track": {
            bgcolor: "primary.main",
            borderRadius: 0,
            opacity: 1,
            borderColor: "white",
          },
        }}
      >
        <Box
          sx={{
            pr: 4,
            lineHeight: "100%",
            verticalAlign: "middle",
            "& svg": {
              fontSize: "3rem",
              cursor: "pointer",
            },
          }}
        >
          {playing ? (
            <PauseIcon onClick={() => setPlaying(false)} />
          ) : (
            <PlayArrowIcon onClick={() => setPlaying(true)} />
          )}
        </Box>
        <Slider
          min={0}
          max={numHours}
          value={sliderIdx}
          step={1}
          valueLabelDisplay={"on"}
          valueLabelFormat={valueLabelFormat}
          onChange={(event: any) => {
            if (event.type !== "mousemove") {
              setSliderIdx(event.target.value);
            }
          }}
        />
      </Box>
      <Popover
        sx={{ pointerEvents: "none" }}
        open={Boolean(clickedPixel)}
        elevation={5}
        disableRestoreFocus
        onClose={() => setClickedPixel(undefined)}
        anchorReference="anchorPosition"
        anchorPosition={
          clickedPixel
            ? { left: clickedPixel[0], top: clickedPixel[1] }
            : undefined
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        transitionDuration={0}
      >
        {clickedPixel && <WeatherPopover pixel={clickedPixel} />}
      </Popover>
    </>
  );
};
