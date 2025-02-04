import { Box, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router";
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
        pl: 1,
        width: 500,
        position: "relative",
        zIndex: 10000,
        "& .MuiButtonBase-root.Mui-selected": {
          color: "white",
          fontWeight: "bold",
        },
      }}
    >
      <Tabs
        sx={{
          height: 45,
          minHeight: 45,
          "& .MuiButtonBase-root": {
            height: 52,
            minWidth: 100,
            ":hover": {
              color: "white",
            },
          },
        }}
        value={viewState ?? MenuViewState.Live}
        onChange={(_, newVal: MenuViewState) => handleChange(newVal)}
        textColor="secondary"
        TabIndicatorProps={{
          sx: { bgcolor: "white" },
        }}
      >
        <Tab label="Live" value={MenuViewState.Live}></Tab>
        <Tab label="Områder" value={MenuViewState.Overview}></Tab>
        <Tab label="Turer" value={MenuViewState.Trips}></Tab>
        <Tab label="Mitt fartøy" value={MenuViewState.MyPage}></Tab>
      </Tabs>
    </Box>
  );
};
