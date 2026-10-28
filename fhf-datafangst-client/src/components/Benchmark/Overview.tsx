import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import type { DateRange } from "~/api";
import { BenchmarkCards, LocalLoadingProgress } from "~/components";
import { Ordering } from "~/generated/openapi";
import { VesselRankingType } from "~/models";
import {
  getAvgVesselBenchmark,
  getLandingCatchWeights,
  getTripBenchmarks,
  selectAvgVesselBenchmark,
  selectAvgVesselBenchmarkLoading,
  selectLoggedInVessel,
  selectVesselRankingType,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { EEOI } from "./EEOI";
import { GeneralStatsCard } from "./GeneralStatsCard";
import { CatchChart } from "./Graphs/CatchChart";
import { VesselRanking } from "./VesselRanking";

interface Props {
  dateRange?: DateRange;
}

export const BenchmarkOverview: FC<Props> = ({ dateRange }) => {
  const dispatch = useAppDispatch();

  const vessel = useAppSelector(selectLoggedInVessel);
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);
  const benchmarkLoading = useAppSelector(selectAvgVesselBenchmarkLoading);
  const vesselRankingType = useAppSelector(selectVesselRankingType);

  useEffect(() => {
    if (vessel) {
      dispatch(
        getAvgVesselBenchmark({
          callSignOverride: vessel?.fiskeridir.callSign,
          start: dateRange?.start,
          end: dateRange?.end,
          useFollowingList: vesselRankingType === VesselRankingType.Following,
        }),
      );
      dispatch(
        getTripBenchmarks({
          start: dateRange?.start,
          end: dateRange?.end,
          ordering: Ordering.Asc,
          callSignOverride: vessel?.fiskeridir.callSign,
        }),
      );
      dispatch(
        getLandingCatchWeights({
          start: dateRange?.start,
          end: dateRange?.end,
          callSignOverride: vessel?.fiskeridir.callSign,
        }),
      );
    }
  }, [vessel, dateRange, vesselRankingType]);

  if (!vessel) {
    return <></>;
  }

  return (
    <>
      {benchmarkLoading && <LocalLoadingProgress />}
      <Box
        sx={{
          p: 2,
          display: "grid",
          width: "100%",
          height: "100%",
          gap: 3,
          gridTemplateColumns: "1fr auto minmax(450px, 23%)",
          gridTemplateRows: "auto 1fr 1fr",
          gridTemplateAreas: `
          'general general rank'
          'kpi eeoi rank'
          'chart chart rank'
          `,
        }}
      >
        {avgVesselBenchmark ? (
          <>
            <Box sx={{ gridColumn: "1 / 3", gridRow: "1 / 1" }}>
              <GeneralStatsCard />
            </Box>
            <Box sx={{ gridArea: "kpi" }}>
              <BenchmarkCards />
            </Box>
            <Box sx={{ gridArea: "chart" }}>
              <CatchChart />
            </Box>
            <Box sx={{ gridArea: "rank" }}>
              <VesselRanking />
            </Box>
            <Box sx={{ gridColumn: "2 / 3", gridRow: "2 / 2" }}>
              <EEOI />
            </Box>
          </>
        ) : (
          <>
            {!benchmarkLoading && (
              <Box sx={{ gridColumn: "1 / 3", gridRow: "1 / 4" }}>
                <Typography sx={{ fontStyle: "italic", fontSize: "1.3rem" }}>
                  Fant ingen data for ditt fartøy på følgende tidsseleksjon
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};
