import LayersIcon from "@mui/icons-material/Layers";
import MapSharpIcon from "@mui/icons-material/MapSharp";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import { CoastlineIcon, DeliveryPointIcon } from "assets/icons";
import { MapFilter } from "containers/HomeView/HomeView";
import { FC } from "react";

interface Props {
  mapFilter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
  up?: boolean;
  small?: boolean;
}

const activeStyle = {
  bgcolor: "primary.light",
  "& .MuiSpeedDialAction-fab": {
    color: "white",
    bgcolor: "primary.light",
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
        zIndex: 1,
      }}
    >
      <SpeedDial
        ariaLabel="MapFilters"
        FabProps={small ? { size: "small" } : {}}
        direction={up ? "up" : "down"}
        sx={{
          "& .MuiFab-primary": {
            borderRadius: 0,
            bgcolor: "primary.light",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          },
          "& .MuiFab-root": { borderRadius: 0 },
        }}
        icon={<LayersIcon />}
      >
        <SpeedDialAction
          sx={
            mapFilter.deliveryPoints
              ? activeStyle
              : { "&:hover": { svg: { color: "primary.light" } } }
          }
          onClick={() => handleChange("deliveryPoints")}
          icon={<DeliveryPointIcon />}
          tooltipTitle={"Vis fiskemottak"}
          tooltipPlacement="left"
        />
        <SpeedDialAction
          sx={
            mapFilter.coastline
              ? activeStyle
              : { "&:hover": { svg: { color: "primary.light" } } }
          }
          onClick={() => handleChange("coastline")}
          icon={<CoastlineIcon />}
          tooltipTitle={"Vis kystlinje"}
          tooltipPlacement="left"
        />
        <SpeedDialAction
          sx={
            mapFilter.seamap
              ? activeStyle
              : { "&:hover": { svg: { color: "primary.light" } } }
          }
          onClick={() => handleChange("seamap")}
          icon={<MapSharpIcon />}
          tooltipTitle={"Vis sjøkart"}
          tooltipPlacement="left"
        />
      </SpeedDial>
    </Box>
  );
};
