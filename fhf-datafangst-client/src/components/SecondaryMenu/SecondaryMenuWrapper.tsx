import { Box, Drawer } from "@mui/material";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SecondaryMenuWrapper: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Drawer
        sx={{
          zIndex: 5000,
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            position: "relative",
            backgroundColor: "primary.light",
            color: "white",
          },
        }}
        open
        variant="persistent"
        anchor="right"
      >
        <OverlayScrollbarsComponent
          className="overlayscrollbars-react"
          options={{ scrollbars: { theme: "os-theme-light" } }}
          defer
        >
          {children}
        </OverlayScrollbarsComponent>
      </Drawer>
    </Box>
  );
};
