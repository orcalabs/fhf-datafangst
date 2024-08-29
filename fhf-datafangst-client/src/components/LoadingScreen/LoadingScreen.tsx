import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { FC } from "react";

interface Props {
  open: boolean;
}

export const LoadingScreen: FC<Props> = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "white",
        bgcolor: "rgba(44, 98, 113, 0.4)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
