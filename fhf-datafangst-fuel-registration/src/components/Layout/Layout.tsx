import { Box, useMediaQuery } from "@mui/material";
import theme from "app/theme";
import { Header } from "components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        height: ["100vh", "100dvh"],
        width: "100%",
        bgcolor: "rgb(237, 240, 243)",
      }}
    >
      <Header />
      {isMobile ? (
        <main>{children}</main>
      ) : (
        <OverlayScrollbarsComponent
          className="overlayscrollbars-react"
          options={{
            scrollbars: { theme: "os-theme-dark" },
          }}
          defer
        >
          <main style={{ height: "calc(100vh - 64px)" }}>{children}</main>
        </OverlayScrollbarsComponent>
      )}
    </Box>
  );
};
