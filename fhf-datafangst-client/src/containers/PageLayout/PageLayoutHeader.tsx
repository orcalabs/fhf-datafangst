import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface Props {
  open?: boolean;
  children?: ReactNode;
}

export const PageLayoutHeader: FC<Props> = ({ open = true, children }) => {
  return open ? <Box sx={{ gridArea: "header" }}>{children}</Box> : <></>;
};
