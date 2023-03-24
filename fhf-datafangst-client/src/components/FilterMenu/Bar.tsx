import { Box } from "@mui/material";
import theme from "app/theme";
import { FC } from "react";

interface Props {
  length: number;
  label: string;
  value: number;
  selected: boolean;
}

export const Bar: FC<Props> = (props) => {
  const { length, label, value, selected } = props;

  return (
    <Box sx={{ display: "flex", mb: 1 }}>
      <Box sx={{ width: 100, fontSize: 13 }}>{label}</Box>
      <Box
        sx={{
          width: "100%",
          position: "relative",
          border: selected
            ? `1px solid ${theme.palette.secondary.main}`
            : "1px solid grey",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            fontSize: 13,
            width: 200,
            textAlign: "center",
            marginRight: "auto",
            marginLeft: "auto",
            right: 0,
            left: 0,
          }}
        >
          {value}
        </Box>
        <Box
          sx={{
            minWidth: "2%",
            width: length.toString() + "%",
            height: 20,
            bgcolor: selected ? "secondary.main" : "grey",
          }}
        ></Box>
      </Box>
    </Box>
  );
};
