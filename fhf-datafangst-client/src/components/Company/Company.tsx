import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import theme from "app/theme";
import { DateFilter, LocalLoadingProgress } from "components";
import { DateRange } from "components/SearchFilters/DateFilter";
import { endOfYear, startOfYear } from "date-fns";
import { RegisterVesselEntityType } from "generated/openapi";
import { FC, useEffect, useState } from "react";
import {
  getOrgBenchmarks,
  getOrgFuelConsumption,
  selectLoggedInVessel,
  selectOrgBenchmarks,
  selectOrgBenchmarksLoading,
  useAppDispatch,
  useAppSelector,
} from "store";
import { CatchStats } from "./CatchStats";
import { GeneralStats } from "./GeneralStats";

export const Company: FC = () => {
  const dispatch = useAppDispatch();

  const orgBenchmarks = useAppSelector(selectOrgBenchmarks);
  const orgBenchmarksLoading = useAppSelector(selectOrgBenchmarksLoading);
  const vessel = useAppSelector(selectLoggedInVessel);

  const [tabValue, setTabValue] = useState("general");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    new DateRange(
      startOfYear(new Date(2024, 1, 1)),
      endOfYear(new Date(2024, 1, 1)),
    ),
  );

  const orgId =
    vessel?.fiskeridir.owners[0]?.entityType ===
    RegisterVesselEntityType.Company
      ? vessel.fiskeridir.owners[0].id
      : undefined;

  useEffect(() => {
    if (orgId) {
      dispatch(
        getOrgBenchmarks({
          orgId,
          start: dateRange?.start,
          end: dateRange?.end,
          callSignOverride: vessel?.fiskeridir.callSign,
        }),
      );

      dispatch(
        getOrgFuelConsumption({
          orgId,
          startDate: dateRange?.start,
          endDate: dateRange?.end,
          callSignOverride: vessel?.fiskeridir.callSign,
        }),
      );
    }
  }, [dateRange, orgId, vessel?.fiskeridir.callSign]);

  if (orgBenchmarksLoading) {
    return <LocalLoadingProgress />;
  }

  return (
    <Stack spacing={2} sx={{ p: 2, width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">
          {vessel?.fiskeridir.owners[0]?.name}
        </Typography>

        <Box sx={{ width: 400 }}>
          <DateFilter value={dateRange} onChange={setDateRange} />
        </Box>
      </Stack>
      <Tabs
        sx={{ borderBottom: `1px solid ${theme.palette.text.secondary}` }}
        indicatorColor="secondary"
        value={tabValue}
        onChange={(_, newVal: string) => setTabValue(newVal)}
      >
        <Tab value="general" label="Generelt" />
        <Tab value="catches" label="Fangst" />
        <Tab value="performance" label="Ytelse" />
      </Tabs>
      {orgBenchmarks && (
        <Box>
          {tabValue === "general" && (
            <GeneralStats vesselEntries={orgBenchmarks?.vessels} />
          )}
          {tabValue === "catches" && (
            <CatchStats vesselEntries={orgBenchmarks?.vessels} />
          )}
        </Box>
      )}
    </Stack>
  );
};
