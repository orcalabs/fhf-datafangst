import { Box, useMediaQuery } from "@mui/material";
import { Header } from "components";
import React, { lazy, ReactNode } from "react";

const LayoutDesktop = lazy(() => import("./LayoutDesktop"));

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const isTouch = useMediaQuery("(pointer: coarse)");

  return (
    <Box
      sx={{
        height: ["100vh", "100dvh"],
        width: "100%",
        bgcolor: "rgb(237, 240, 243)",
      }}
    >
      <Header />
      {isTouch ? (
        <main>{children}</main>
      ) : (
        <LayoutDesktop>{children}</LayoutDesktop>
      )}
    </Box>
  );
};
