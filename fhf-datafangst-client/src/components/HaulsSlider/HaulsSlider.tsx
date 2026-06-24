import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo } from "react";
import {
  selectSelectedOrCurrentTrip,
  selectSelectedTripHaul,
  setSelectedTripHaul,
  useAppDispatch,
  useAppSelector,
} from "~/store";

export const HaulsSlider: FC = () => {
  const dispatch = useAppDispatch();
  const trip = useAppSelector(selectSelectedOrCurrentTrip);

  const haul = useAppSelector(selectSelectedTripHaul);
  const open = haul !== undefined;

  const sliderValue = useMemo(() => {
    if (!trip || !haul) return 0;

    const idx = trip.hauls.findIndex((h) => h.id === haul.id);
    return idx >= 0 ? idx : 0;
  }, [trip, haul]);

  const handleSliderChange = (idx: number) => {
    dispatch(setSelectedTripHaul(trip?.hauls[idx]));
  };

  const handleSliderButtonClick = (idx: number) => {
    if (!trip) {
      return;
    }
    if (idx < 0 || idx > trip.hauls.length - 1) {
      return;
    }
    dispatch(setSelectedTripHaul(trip.hauls[idx]));
  };

  const handleOpenSlider = () => {
    if (!open) {
      handleSliderChange(0);
    } else {
      dispatch(setSelectedTripHaul(undefined));
    }
  };

  if (!trip || !trip.hauls.length) {
    return <></>;
  }
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Button
          sx={[
            {
              position: "absolute",
              textTransform: "none",
              zIndex: 1000,
              top: -40,
              height: 40,
              left: "50%",
              px: 1,
              bgcolor: "primary.light",
              color: "white",
              width: 125,
              borderRadius: 0,
              border: 0,
              justifyContent: "space-evenly",
              ":hover": {
                bgcolor: "primary.dark",
                borderRadius: 0,
              },
              "& .MuiButton-startIcon": {
                mr: 0,
                ml: -3,
              },
            },
            open && {
              svg: {
                transform: "scaleY(-1)",
              },
            },
          ]}
          onClick={() => handleOpenSlider()}
          startIcon={<KeyboardDoubleArrowUpIcon stroke="white" />}
        >
          <Typography>{open ? "Skjul hal" : "Vis hal"} </Typography>
        </Button>
      </Box>
      {open && (
        <Box
          id="slider-container"
          sx={{
            position: "relative",
            display: "flex",
            zIndex: 99999,
            height: 60,
            bgcolor: "rgba(238, 238, 238, 0.6)",
            alignItems: "center",
            "& .MuiSlider-root": { width: "100%", borderRadius: 0 },
            "& .MuiSlider-valueLabel": { bgcolor: "primary.light" },
            "& .MuiSlider-markLabel": { color: "black" },
            "& .MuiSlider-mark": {
              height: 8,
              width: 8,
              border: "1px solid white",
              bgcolor: "fourth.main",
              borderRadius: 5,
            },

            "& .MuiSlider-thumb": {
              width: 17,
              height: 17,
              bgcolor: "primary.light",
              borderRadius: 0,
              opacity: 1,
            },
            "& .MuiSlider-track": {
              opacity: 0,
            },
          }}
        >
          <IconButton
            sx={{
              borderRadius: 0,
              mr: 2,
              width: 60,
              height: 60,
              ":hover": {
                bgcolor: "rgba(194, 199, 221, 0.8)",
              },
            }}
            onClick={() => handleSliderButtonClick(sliderValue - 1)}
          >
            <NavigateBeforeIcon sx={{ color: "primary.light" }} />
          </IconButton>
          <Slider
            value={sliderValue}
            min={0}
            max={trip.hauls.length - 1}
            step={1}
            marks
            valueLabelDisplay={"on"}
            valueLabelFormat={(idx) => `Hal ${idx + 1}`}
            onChange={(event: any) => handleSliderChange(event.target.value)}
          />
          <IconButton
            onClick={() => handleSliderButtonClick(sliderValue + 1)}
            sx={{
              borderRadius: 0,
              ml: 2,
              width: 60,
              height: 60,
              ":hover": {
                bgcolor: "rgba(194, 199, 221, 0.8)",
              },
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};
