import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC } from "react";
import {
  ViewState,
  selectViewState,
  setHoveredFilter,
  setViewState,
  useAppDispatch,
  useAppSelector,
} from "store";

export const HeaderMenuButtons: FC = () => {
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectViewState);

  const handleChange = (newValue: ViewState) => {
    dispatch(setViewState(newValue));
    dispatch(setHoveredFilter(undefined));
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
            "&:hover": { bgcolor: "primary.light" },
          },
          "&:hover": { bgcolor: "secondary.dark" },
        },
      }}
    >
      <ToggleButtonGroup
        size="small"
        value={viewState}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: ViewState) =>
          handleChange(newValue)
        }
      >
        <ToggleButton value={ViewState.Overview}>Fangstdata</ToggleButton>
        <ToggleButton value={ViewState.MyPage}>Mitt fartøy</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
