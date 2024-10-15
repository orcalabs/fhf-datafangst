import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { Box, Button, Slider, Typography } from "@mui/material";
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
  disabled: boolean;
  options?: Options;
  minYear: number;
  onValueChange: (date: Date) => void;
  onOpenChange: (open: boolean) => void;
}

export const TimeSlider: FC<Props> = ({
  disabled,
  options,
  minYear,
  onValueChange,
  onOpenChange,
}) => {
  const [open, setOpen] = useState<boolean>(false);

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

  useEffect(() => {
    const scale = document.getElementById("map-controls") as HTMLElement;

    // Move scale line up
    if (open) {
      scale.style.bottom = "70px";
    } else {
      scale.style.bottom = "10px";
    }

    return () => {
      scale.style.bottom = "10px";
    };
  }, [open]);

  const valueLabelFormat = (idx: number) => {
    const month = selectedDates[idx].getMonth() + 1;
    return Months[month];
  };

  if (disabled) {
    return <></>;
  }

  return (
    <>
      <Button
        sx={[
          {
            textTransform: "none",
            zIndex: 2000,
            left: "50%",
            height: 40,
            bgcolor: "primary.light",
            color: "white",
            width: 160,
            borderRadius: 0,
            border: 0,
            justifyContent: "left",
            ":hover": {
              bgcolor: "primary.dark",
              borderRadius: 0,
            },
          },
          open && {
            svg: {
              transform: "scaleY(-1)",
            },
          },
        ]}
        onClick={() => handleOpenSlider()}
      >
        <KeyboardDoubleArrowUpIcon
          stroke="white"
          width={10}
          height={10}
          fontSize="small"
          sx={{ mr: 2 }}
        />
        <Typography>{open ? "Skjul tidslinje" : "Vis tidslinje"} </Typography>
      </Button>
      {open && (
        <Box
          id="slider-container"
          sx={{
            position: "relative",
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
          <Slider
            min={0}
            marks={createMarks()}
            max={selectedDates.length - 1}
            step={1}
            valueLabelDisplay={"on"}
            valueLabelFormat={valueLabelFormat}
            onChange={(event: any) => handleSliderChange(event.target.value)}
          />
        </Box>
      )}
    </>
  );
};
