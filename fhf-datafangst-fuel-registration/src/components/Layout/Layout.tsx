import { Box } from "@mui/material";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <OverlayScrollbarsComponent
      className="overlayscrollbars-react"
      options={{ scrollbars: { theme: "os-theme-light" } }}
      defer
    >
      <Box
        sx={{
          height: ["100vh", "100dvh"],
          width: "100%",
          bgcolor: "rgb(237, 240, 243)",
        }}
      >
        <main>{children}</main>
      </Box>
    </OverlayScrollbarsComponent>
  );
};
