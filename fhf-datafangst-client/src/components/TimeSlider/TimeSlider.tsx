import { FC, useEffect, useMemo, useState } from "react";
import { Box, Button, Slider, Typography } from "@mui/material";
import { selectHaulsMatrixSearch, useAppSelector } from "store";
import { Months } from "utils";
import { getAllYearsArray } from "components/Filters/YearsFilter";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

export const TimeSlider: FC = () => {
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const [open, setOpen] = useState<boolean>(false);

  const handleSliderChange = (_: number) => {
    // Insert matrix change operation here.
  };

  const handleOpenSlider = () => {
    setOpen(!open);

    // Reads the previous value before previous set, hence the wrongful logic of if-statement.
    // if (open) {
    //   scale.style.bottom = "10px";
    // }

    // Insert first matrix call here
  };

  const selectedDates = useMemo(() => {
    const years = haulsSearch?.years?.length
      ? haulsSearch?.years
      : getAllYearsArray();
    const months = haulsSearch?.months?.length
      ? haulsSearch?.months
      : Array.from({ length: 12 }, (_, i) => i + 1);

    const selectedDates = years
      .map((y) =>
        months.map((m) => ({
          id: y * 12 + m - 1,
          value: new Date(y, m, 1),
        })),
      )
      .flat();

    return selectedDates.sort((a, b) => {
      return a.value.getTime() - b.value.getTime();
    });
  }, [haulsSearch]);

  const createMarks = () => {
    const marksArray = [];
    if (!haulsSearch?.months) {
      return;
    }
    for (let i = 0; i < selectedDates.length; i++) {
      if (i % haulsSearch.months.length === 0) {
        marksArray.push({
          value: i,
          label: selectedDates[i].value.getFullYear(),
        });
      }
    }

    return marksArray;
  };

  useEffect(() => {
    const scale = document.getElementsByClassName(
      "ol-scale-line",
    )[0] as HTMLElement;

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

  const valueLabelFormat = (value: number) => {
    const month = selectedDates[value].value.getMonth();
    return Months[month];
  };

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
