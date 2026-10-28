import { Stack } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import type { DateRange } from "~/api";
import { LocalLoadingProgress } from "~/components";
import { RegisterVesselEntityType } from "~/generated/openapi";
import {
  getOrgBenchmarks,
  getOrgFuelConsumption,
  selectLoggedInVessel,
  selectOrgBenchmarks,
  selectOrgBenchmarksLoading,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { GeneralStats } from "./GeneralStats";

interface Props {
  dateRange?: DateRange;
}

export const Company: FC<Props> = ({ dateRange }) => {
  const dispatch = useAppDispatch();
  const orgBenchmarks = useAppSelector(selectOrgBenchmarks);
  const orgBenchmarksLoading = useAppSelector(selectOrgBenchmarksLoading);
  const vessel = useAppSelector(selectLoggedInVessel);

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
      {orgBenchmarks && <GeneralStats vesselEntries={orgBenchmarks?.vessels} />}
    </Stack>
  );
};
