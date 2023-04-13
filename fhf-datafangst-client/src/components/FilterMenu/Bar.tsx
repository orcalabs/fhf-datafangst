import { Box, Typography } from "@mui/material";
import theme from "app/theme";
import { FC, useState } from "react";
import { kilosOrTonsFormatter } from "utils";

interface Props {
  length: number;
  label: string;
  value: number;
  selected: boolean;
}

export const Bar: FC<Props> = (props) => {
  const { length, label, value, selected } = props;
  const [hovering, setHovering] = useState(false);

  return (
    <Box sx={{ display: "flex", mb: 1 }}>
      <Typography
        sx={{ width: 220, fontSize: 13 }}
        noWrap
        title={label?.length > 23 ? label : undefined}
      >
        {label}
      </Typography>
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
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
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
          {hovering
            ? kilosOrTonsFormatter(value)
            : length < 1
            ? length.toPrecision(1) + "%"
            : length.toFixed(1).toString() + "%"}
        </Box>
        <Box
          sx={{
            minWidth: "2px",
            width: length.toString() + "%",
            height: 20,
            bgcolor: selected ? "secondary.main" : "grey",
          }}
        ></Box>
      </Box>
    </Box>
  );
};
