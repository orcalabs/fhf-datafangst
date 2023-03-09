import { FC } from "react";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import { MapFilter } from "containers/HomeView/HomeView";
import LayersIcon from "@mui/icons-material/Layers";
import { CoastlineIcon } from "assets/icons";

interface Props {
  mapFilter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
  up?: boolean;
  small?: boolean;
}

const activeStyle = {
  bgcolor: "primary.main",
  "& .MuiSpeedDialAction-fab": {
    color: "white",
    bgcolor: "primary.main",
  },
  svg: { color: "white" },
  "&:hover": { bgcolor: "primary.dark" },
} as const;

export const MapFilters: FC<Props> = (props) => {
  const { mapFilter, onFilterChange, up, small } = props;

  const handleChange = (name: string) => {
    onFilterChange({
      ...mapFilter,
      [name]: !mapFilter[name],
    });
  };

  return (
    <Box
      sx={{
        pr: 2,
        pt: 2,
        pointerEvents: "none",
        height: 56,
        zIndex: 1000,
      }}
    >
      <SpeedDial
        ariaLabel="MapFilters"
        FabProps={small ? { size: "small" } : {}}
        direction={up ? "up" : "down"}
        sx={{
          "& .MuiFab-primary": {
            borderRadius: 0,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
              svg: { bgcolor: "primary.dark" },
            },
          },
          "& .MuiFab-root": { borderRadius: 0 },
        }}
        icon={<LayersIcon />}
      >
        <SpeedDialAction
          sx={mapFilter.coastline ? activeStyle : {}}
          onClick={() => handleChange("coastline")}
          icon={<CoastlineIcon />}
          tooltipTitle={"Vis kystlinje"}
          tooltipPlacement="left"
        />
      </SpeedDial>
    </Box>
  );
};
