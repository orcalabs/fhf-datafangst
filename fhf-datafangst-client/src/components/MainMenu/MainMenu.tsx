import { Box, Drawer } from "@mui/material";
import { CatchData, LiveAisMenu, MyPage, Trips } from "components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC } from "react";
import { MenuViewState, selectSelectedLiveVessel, useAppSelector } from "store";

export interface Props {
  view: MenuViewState;
}

// `MainMenu` needs to take `MenuViewState` as a direct prop instead of
// getting it from the state because the state lags slightly behind
// the url (due to how `useEffect`s work) and it needs the most
// up-to-date value (i.e. from the url) to render the correct component.
export const MainMenu: FC<Props> = ({ view }) => {
  const livePosition = useAppSelector(selectSelectedLiveVessel);

  if (view === MenuViewState.Live && !livePosition) {
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
          {view === MenuViewState.Overview && <CatchData />}
          {view === MenuViewState.Live && <LiveAisMenu />}
          {view === MenuViewState.Trips && <Trips />}
          {view === MenuViewState.MyPage && <MyPage />}
        </OverlayScrollbarsComponent>
      </Drawer>
    </Box>
  );
};
