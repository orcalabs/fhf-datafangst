import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { startOfYear } from "date-fns";
import type { FC } from "react";
import { useState } from "react";
import { DateRange } from "~/api";
import theme from "~/app/theme";
import {
  BenchmarkOverview,
  Company,
  DateFilter,
  OverlayScrollbars,
  TripBenchmarkPage,
} from "~/components";

export const MyStats: FC = () => {
  const [tabValue, setTabValue] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(startOfYear(new Date()), new Date()),
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#EDF0F3",
      }}
    >
      <Stack sx={{ p: 3, pb: 0, height: "100%" }} spacing={3}>
        <Stack
          direction="row"
          spacing={10}
          sx={{ justifyContent: "space-between", pr: 5 }}
        >
          <Stack spacing={2}>
            <Typography variant="h2">Statistikker</Typography>
            <Tabs
              sx={{
                width: "100%",
                alignSelf: "flex-start",
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
          </Stack>

          <Box>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              validateRange
              showShortCuts
            />
          </Box>
        </Stack>
        <Stack sx={{ overflowY: "hidden" }}>
          <OverlayScrollbars darkTheme>
            {tabValue === "overview" && (
              <BenchmarkOverview dateRange={dateRange} />
            )}
            {tabValue === "performance" && <TripBenchmarkPage />}
            {tabValue === "company" && <Company />}
          </OverlayScrollbars>
        </Stack>
      </Stack>
    </Box>
  );
};
