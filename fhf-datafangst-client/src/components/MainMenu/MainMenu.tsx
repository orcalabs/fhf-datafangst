import { Box, Drawer } from "@mui/material";
import { CatchData, MyPage, Trips } from "components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC } from "react";
import { MenuViewState, selectViewState, useAppSelector } from "store";

export const MainMenu: FC = () => {
  const viewState = useAppSelector(selectViewState);

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.light",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
        }}
      >
        <OverlayScrollbarsComponent
          className="overlayscrollbars-react"
          options={{ scrollbars: { theme: "os-theme-light" } }}
          defer
        >
          {viewState === MenuViewState.Overview && <CatchData />}
          {viewState === MenuViewState.Trips && <Trips />}
          {viewState === MenuViewState.MyPage && <MyPage />}
        </OverlayScrollbarsComponent>
      </Drawer>
    </Box>
  );
};
