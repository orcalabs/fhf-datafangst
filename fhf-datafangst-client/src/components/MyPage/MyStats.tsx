import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import theme from "app/theme";
import { BenchmarkOverview, Company, TripBenchmarkPage } from "components";
import { FC, useState } from "react";

export const MyStats: FC = () => {
  const [tabValue, setTabValue] = useState("overview");
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
        <Typography variant="h2">Statistikker</Typography>
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
            value="overview"
            label="Oversikt"
          />
          <Tab
            sx={{
              color: theme.palette.grey[500],
            }}
            value="performance"
            label="Ytelse"
          />
          <Tab
            sx={{
              color: theme.palette.grey[500],
            }}
            value="company"
            label="Rederi"
          />
        </Tabs>
        <Box sx={{ height: "100%", overflowY: "auto" }}>
          {tabValue === "overview" && <BenchmarkOverview />}
          {tabValue === "performance" && <TripBenchmarkPage />}
          {tabValue === "company" && <Company />}
        </Box>
      </Stack>
    </Box>
  );
};
