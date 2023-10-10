import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";

const MenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}
  >
    {props.children}
  </Box>
);
export const BenchmarkView: FC = () => {

  return (
      <MenuArea></MenuArea>
  );
};
