import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC } from "react";
import {
  MenuViewState,
  selectViewState,
  setHoveredHaulFilter,
  setViewState,
  useAppDispatch,
  useAppSelector,
} from "store";

export const HeaderMenuButtons: FC = () => {
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectViewState);

  const handleChange = (newValue: MenuViewState) => {
    if (newValue !== null) {
      dispatch(setViewState(newValue));
      dispatch(setHoveredHaulFilter(undefined));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        zIndex: 10000,
        "& .MuiToggleButtonGroup-root": {
          width: "100%",
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButtonGroup-grouped": {
          width: "100%",
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButton-root": {
          color: "white",
          px: 2,
          height: 49,
          border: 0,
          width: "50%",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.main" },
          },
          "&:hover": { bgcolor: "secondary.dark" },
        },
      }}
    >
      <ToggleButtonGroup
        size="small"
        value={viewState}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: MenuViewState) =>
          handleChange(newValue)
        }
      >
        <ToggleButton value={MenuViewState.Overview}>Områder</ToggleButton>
        <ToggleButton value={MenuViewState.Trips}>Turer</ToggleButton>
        <ToggleButton value={MenuViewState.MyPage}>Mitt fartøy</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
