import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import { HaulsFilter, LandingsFilter } from "api";
import { getAllYearsArray } from "components/Filters/YearsFilter";
import { isFuture } from "date-fns";
import { FC, useEffect, useMemo, useState } from "react";
import { Months } from "utils";

const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

interface Options {
  years?: number[];
  months?: number[];
  filter?: HaulsFilter | LandingsFilter;
}

interface Props {
  disabled?: boolean;
  options?: Options;
  minYear: number;
  onValueChange: (date: Date) => void;
  onOpenChange: (open: boolean) => void;
}

export const TimeSlider: FC<Props> = ({
  disabled = false,
  options,
  minYear,
  onValueChange,
  onOpenChange,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);

  const selectedDates = useMemo(() => {
    const years = options?.years?.length
      ? options?.years
      : getAllYearsArray(minYear);

    const months = options?.months?.length ? options?.months : allMonths;

    const res = years
      .map((y) => months.map((m) => new Date(y, m - 1, 1)))
      .flat()
      .sort((a, b) => a.getTime() - b.getTime());

    // Remove future months (happens when current year is selected)
    for (let i = 0; i < res.length; i++) {
      if (isFuture(res[i])) {
        res.splice(i, res.length - 1);
        break;
      }
    }

    return res;
  }, [options?.years, options?.months]);

  useEffect(() => {
    if (options?.filter !== HaulsFilter.Date) {
      setOpen(false);
    }
  }, [options?.filter]);

  const handleSliderChange = (idx: number) => {
    onValueChange(selectedDates[idx]);
    setSliderValue(idx);
  };

  const handleSliderButtonClick = (idx: number) => {
    if (idx < 0 || idx > selectedDates.length - 1) {
      return;
    }
    setSliderValue(idx);
    onValueChange(selectedDates[idx]);
  };

  const handleOpenSlider = () => {
    setOpen(!open);
    onOpenChange(!open);

    if (!open) {
      handleSliderChange(0);
    }
  };

  const createMarks = () => {
    const marks = [];
    for (let i = 0, prev = -1; i < selectedDates.length; i++) {
      const year = selectedDates[i].getFullYear();
      if (year !== prev) {
        marks.push({ value: i, label: year });
        prev = year;
      }
    }

    return marks.length > 1 ? marks : undefined;
  };

  const valueLabelFormat = (idx: number) => {
    const month = selectedDates[idx].getMonth() + 1;
    return Months[month];
  };

  if (disabled) {
    return <></>;
  }

  return (
    <>
      <Box position="relative">
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
              width: 145,
              borderRadius: 0,
              border: 0,
              justifyContent: "space-evenly",
              ":hover": {
                bgcolor: "primary.dark",
                borderRadius: 0,
              },
              "& .MuiButton-startIcon": {
                mr: 0,
                ml: -1,
              },
            },
            open && {
              svg: {
                transform: "scaleY(-1)",
              },
            },
          ]}
          onClick={() => handleOpenSlider()}
          startIcon={
            <KeyboardDoubleArrowUpIcon
              stroke="white"
              width={10}
              height={10}
              fontSize="small"
            />
          }
        >
          <Typography>{open ? "Skjul tidslinje" : "Vis tidslinje"} </Typography>
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
              height: 15,
              bgcolor: "primary.light",
              opacity: "0.60",
            },
            "& .MuiSlider-markActive": {
              bgcolor: "primary.light",
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
              bgcolor: "primary.light",
              borderRadius: 0,
              opacity: 1,
              borderColor: "white",
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
            marks={createMarks()}
            max={selectedDates.length - 1}
            step={1}
            valueLabelDisplay={"on"}
            valueLabelFormat={valueLabelFormat}
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
