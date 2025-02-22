import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import theme from "app/theme";
import { FuelPage, OverlayScrollbars, VesselSettings } from "components";
import { FollowList } from "components/FollowList/FollowList";
import { FC, useState } from "react";

export const MySettings: FC = () => {
  const [tabValue, setTabValue] = useState("fuel");
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#EDF0F3",
      }}
    >
      <Stack sx={{ p: 3, height: "100%" }} spacing={2}>
        <Typography variant="h2">Administrer</Typography>
        <Tabs
          sx={{
            "& .MuiButtonBase-root.Mui-selected": {
              fontWeight: "bold",
            },
            borderBottom: `1px solid ${theme.palette.text.secondary}`,
          }}
          indicatorColor="secondary"
          textColor="secondary"
          value={tabValue}
          onChange={(_, newVal: string) => setTabValue(newVal)}
        >
          <Tab
            sx={{ color: theme.palette.grey[500] }}
            value="fuel"
            label="Drivstoff"
          />
          <Tab
            sx={{
              color: theme.palette.grey[500],
            }}
            value="vessel"
            label="Fartøy"
          />
          <Tab
            sx={{ color: theme.palette.grey[500] }}
            value="following"
            label="Følgeliste"
          />
        </Tabs>
        <Stack sx={{ overflowY: "hidden", height: "100%" }}>
          <OverlayScrollbars darkTheme style={{ height: "100%" }}>
            {tabValue === "vessel" && <VesselSettings />}
            {tabValue === "following" && <FollowList />}
            {tabValue === "fuel" && <FuelPage />}
          </OverlayScrollbars>
        </Stack>
      </Stack>
    </Box>
  );
};
