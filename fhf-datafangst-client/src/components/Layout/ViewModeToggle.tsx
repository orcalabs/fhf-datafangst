import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC } from "react";
import {
  selectViewMode,
  setViewMode,
  useAppDispatch,
  useAppSelector,
  ViewMode,
} from "store";

export const ViewModeToggle: FC = () => {
  const viewMode = useAppSelector(selectViewMode);
  const dispatch = useAppDispatch();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: ViewMode,
  ) => {
    if (newMode !== null) {
      dispatch(setViewMode(newMode));
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 55,
        left: 510,
        "& .MuiToggleButtonGroup-root": {
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButtonGroup-grouped": {
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButton-root": {
          color: "white",
          px: 2,
          height: 31,
          border: 1,
          borderColor: "primary.light",
          "&.Mui-selected": {
            backgroundColor: "primary.dark",
            color: "white",
            "&:hover": { bgcolor: "primary.main" },
          },
          "&:hover": { bgcolor: "primary.main" },
        },
      }}
    >
      <ToggleButtonGroup
        color="secondary"
        value={viewMode}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value={ViewMode.Grid}>Grid</ToggleButton>
        <ToggleButton value={ViewMode.Heatmap}>Heatmap</ToggleButton>
        <ToggleButton value={ViewMode.Hauls}>Hal</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
