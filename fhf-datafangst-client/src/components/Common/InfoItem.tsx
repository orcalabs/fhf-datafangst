import { styled } from "@mui/material";

export const InfoItem = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

export const iconStyle = {
  position: "relative",
  mr: 5,
  color: "grey.A200",
} as const;
