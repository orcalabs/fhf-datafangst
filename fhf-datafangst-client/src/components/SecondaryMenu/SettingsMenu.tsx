import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import theme from "app/theme";
import { VesselSettings } from "components";
import { FollowList } from "components/FollowList/FollowList";
import { FC, useState } from "react";

export const SettingsMenu: FC = () => {
  const [tabValue, setTabValue] = useState("vessel");
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#EDF0F3",
        zIndex: 1500,
      }}
    >
      <Stack sx={{ p: 3, height: "100%" }} spacing={2}>
        <Typography variant="h2">Innstillinger</Typography>
        <Tabs
          sx={{ borderBottom: `1px solid ${theme.palette.text.secondary}` }}
          indicatorColor="secondary"
          value={tabValue}
          onChange={(_, newVal: string) => setTabValue(newVal)}
        >
          <Tab value="vessel" label="Fartøy" />
          <Tab value="following" label="Følgeliste" />
        </Tabs>
        <Box sx={{ height: "100%" }}>
          {tabValue === "vessel" && <VesselSettings />}
          {tabValue === "following" && <FollowList />}
        </Box>
      </Stack>
    </Box>
  );
};
