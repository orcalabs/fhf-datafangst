import { Box, Drawer } from "@mui/material";
import { CatchData, LiveAisMenu, MyPage, Trips } from "components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC } from "react";
import {
  MenuViewState,
  selectSelectedLivePosition,
  selectViewState,
  useAppSelector,
} from "store";

export const MainMenu: FC = () => {
  const viewState = useAppSelector(selectViewState);
  const livePosition = useAppSelector(selectSelectedLivePosition);

  if (viewState === MenuViewState.Live && !livePosition) {
    return <></>;
  }

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
          {viewState === MenuViewState.Live && <LiveAisMenu />}
          {viewState === MenuViewState.Trips && <Trips />}
          {viewState === MenuViewState.MyPage && <MyPage />}
        </OverlayScrollbarsComponent>
      </Drawer>
    </Box>
  );
};
