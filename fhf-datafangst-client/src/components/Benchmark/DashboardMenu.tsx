import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC } from "react";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import PeopleSharpIcon from "@mui/icons-material/PeopleSharp";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import {
  DashboardViewState,
  selectActiveDashboardMenu,
  setActiveDashboardMenu,
} from "store/dashboard";
import { useAppDispatch, useAppSelector } from "store";
import theme, { fontStyle } from "app/theme";

const menuItems = [
  {
    id: DashboardViewState.Overview,
    name: "Oversikt",
    icon: <DashboardSharpIcon />,
  },
  {
    id: DashboardViewState.Follow,
    name: "Følgeliste",
    icon: <PeopleSharpIcon />,
  },
  {
    id: DashboardViewState.Fuel,
    name: "Drivstoff",
    icon: <LocalGasStationIcon />,
  },
];

export const DashboardMenu: FC = () => {
  const activeMenu = useAppSelector(selectActiveDashboardMenu);
  const dispatch = useAppDispatch();

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
              onClick={() => dispatch(setActiveDashboardMenu(item.id))}
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
