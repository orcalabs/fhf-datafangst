import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface Props {
  children?: ReactNode;
}

export const PageLayout: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        maxHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "min-content 1fr min-content",
        gridTemplateRows: "min-content min-content 1fr min-content",
        gridTemplateAreas: `
            'header header header'
            'left center-top right'
            'left center right'
            'left center-bottom right'
        `,
      }}
    >
      {children}
    </Box>
  );
};
