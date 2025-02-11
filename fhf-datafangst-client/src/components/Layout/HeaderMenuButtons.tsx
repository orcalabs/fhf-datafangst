import { Box, Tab, Tabs } from "@mui/material";
import { AppPage } from "containers/App/App";
import { FC } from "react";
import { useNavigate } from "react-router";

export interface Props {
  page: AppPage;
}

export const HeaderMenuButtons: FC<Props> = ({ page }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        pl: 1,
        width: 500,
        "& .MuiButtonBase-root.Mui-selected": {
          color: "white",
          fontWeight: "bold",
        },
      }}
    >
      <Tabs
        sx={{
          "& .MuiButtonBase-root": {
            minWidth: 100,
            ":hover": {
              color: "white",
            },
          },
        }}
        value={page}
        onChange={(_, newPage: AppPage) => navigate(`/${newPage}`)}
        textColor="secondary"
        TabIndicatorProps={{
          sx: { bgcolor: "white" },
        }}
      >
        <Tab label="Live" value={AppPage.Live}></Tab>
        <Tab label="Områder" value={AppPage.Area}></Tab>
        <Tab label="Turer" value={AppPage.Trips}></Tab>
        <Tab label="Mitt fartøy" value={AppPage.MyPage}></Tab>
      </Tabs>
    </Box>
  );
};
