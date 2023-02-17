import React, { ReactNode, useEffect } from "react";
import { Box } from "@mui/system";
import { getVessels, useAppDispatch } from "store";

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getVessels());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main>{children}</main>
    </Box>
  );
};
