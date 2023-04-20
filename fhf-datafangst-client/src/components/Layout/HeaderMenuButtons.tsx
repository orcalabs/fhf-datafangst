import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC } from "react";

interface Props {
  value: string | undefined;
  onToggleChange: (selectedButton: string) => void;
}

export const HeaderMenuButtons: FC<Props> = (props) => {
  const { value, onToggleChange } = props;
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        zIndex: 10000,
        "& .MuiToggleButtonGroup-root": {
          width: "100%",
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButtonGroup-grouped": {
          width: "100%",
          borderRadius: 0,
          fontSize: "0.9rem",
        },
        "& .MuiToggleButton-root": {
          color: "white",
          px: 2,
          height: 49,
          border: 0,
          width: "50%",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.light" },
          },
          "&:hover": { bgcolor: "secondary.dark" },
        },
      }}
    >
      <ToggleButtonGroup
        size="small"
        value={value}
        exclusive
        onChange={(_: React.MouseEvent<HTMLElement>, newValue: string) =>
          onToggleChange(newValue)
        }
      >
        <ToggleButton value="catchdata">Fangstdata</ToggleButton>
        <ToggleButton value="vesselprofile">Mitt fartøy</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
