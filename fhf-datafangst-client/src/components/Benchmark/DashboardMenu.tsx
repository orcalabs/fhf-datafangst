import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ScaleIcon from "@mui/icons-material/Scale";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import theme, { fontStyle } from "app/theme";
import { VesselIcon } from "assets/icons";
import { FC } from "react";
import { useNavigate } from "react-router";
import { selectActiveDashboardMenu, useAppSelector } from "store";
import { DashboardViewState } from "store/dashboard";

const menuItems = [
  {
    id: DashboardViewState.Overview,
    name: "Oversikt",
    icon: <DashboardSharpIcon />,
  },
  {
    id: DashboardViewState.Benchmark,
    name: "Benchmark",
    icon: <ScaleIcon />,
  },
  {
    id: DashboardViewState.Company,
    name: "Rederi",
    icon: <VesselIcon />,
  },
  {
    id: DashboardViewState.Fuel,
    name: "Drivstoff",
    icon: <LocalGasStationIcon />,
  },
];

export const DashboardMenu: FC = () => {
  const navigate = useNavigate();

  const activeMenu = useAppSelector(selectActiveDashboardMenu);

  return (
    <Drawer
      variant="permanent"
      sx={{
        height: "100%",
        "& .MuiDrawer-paper": {
          width: 300,
          position: "relative",
          boxSizing: "border-box",
          bgcolor: "primary.main",
          color: "white",
          flexShrink: 0,
          height: "100vh",
        },
        "& .MuiOutlinedInput-root": { borderRadius: 0 },
      }}
    >
      <List component="nav">
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  borderLeft: `5px solid ${theme.palette.fifth.main}`,
                  color: "white",
                  "& .MuiTypography-root": {
                    fontWeight: fontStyle.fontWeightBold,
                  },
                  "&:hover": { bgcolor: "primary.light" },
                  "& .MuiListItemIcon-root": {
                    color: "#FFB340",
                  },
                },
                "&:hover": { bgcolor: "primary.dark" },
              }}
              selected={item.id === activeMenu}
              onClick={() => navigate(`/dashboard/${item.id}`)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
