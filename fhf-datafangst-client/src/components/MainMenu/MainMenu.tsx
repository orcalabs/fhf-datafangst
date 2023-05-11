import { Box, Drawer } from "@mui/material";
import { CatchData, MyPage } from "components";
import { FC } from "react";
import { ViewState, selectViewState, useAppSelector } from "store";

export const MainMenu: FC = () => {
  const viewState = useAppSelector(selectViewState);

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            width: 500,
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& .MuiChip-filled": {
            color: "black",
            bgcolor: "secondary.main",
            borderRadius: 0,
          },
        }}
      >
        {viewState === ViewState.Overview && <CatchData />}
        {viewState === ViewState.MyPage && <MyPage />}
      </Drawer>
    </Box>
  );
};
