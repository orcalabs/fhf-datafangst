import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuViewState,
  selectViewState,
  setHoveredHaulFilter,
  useAppDispatch,
  useAppSelector,
} from "store";

export const HeaderMenuButtons: FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectViewState);

  const handleChange = (newValue: MenuViewState) => {
    if (newValue !== null) {
      navigate(`/${newValue}`);
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
            backgroundColor: "primary.light",
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
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: MenuViewState) =>
          handleChange(newValue)
        }
      >
        <ToggleButton value={MenuViewState.Overview}>Områder</ToggleButton>
        <ToggleButton value={MenuViewState.Live}>Live</ToggleButton>
        <ToggleButton value={MenuViewState.Trips}>Turer</ToggleButton>
        <ToggleButton value={MenuViewState.MyPage}>Mitt fartøy</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
