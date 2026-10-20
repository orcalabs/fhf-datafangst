import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { lineClasses } from "@mui/x-charts/LineChart";
import { useState, type FC } from "react";
import theme from "~/app/theme";
import { FuiIcon, LeafIcon } from "~/assets/icons";
import {
  selectAvgVesselBenchmark,
  selectTripBenchmarks,
  useAppSelector,
} from "~/store";
import { dateFormat, formatNumber } from "~/utils";

export const EEOI: FC = () => {
  const [tripIndex, setTripIndex] = useState<number | null>(null);
  const [fuiTripIndex, setFuiTripIndex] = useState<number | null>(null);
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);
  const tripBenchmarks = useAppSelector(selectTripBenchmarks);
  const eeoiData = tripBenchmarks?.trips.map((trip) => trip.eeoi ?? 0) ?? [];
  const fuiData = tripBenchmarks?.trips.map((trip) => trip.fui ?? 0) ?? [];

  const tripLabels = tripBenchmarks?.trips.map(
    (trip) =>
      `Tur: ${dateFormat(trip.start, "d/M/y")} – ${dateFormat(trip.end, "d/M/y")}`,
  );

  const percentEEOIChange =
    avgVesselBenchmark?.own.eeoi != null && avgVesselBenchmark?.all.eeoi != null
      ? ((avgVesselBenchmark?.own.eeoi - avgVesselBenchmark?.all.eeoi) /
          avgVesselBenchmark?.all.eeoi) *
        100
      : undefined;

  const percentFUIChange =
    avgVesselBenchmark?.own.fui != null && avgVesselBenchmark?.all.fui != null
      ? ((avgVesselBenchmark?.own.fui - avgVesselBenchmark?.all.fui) /
          avgVesselBenchmark?.all.fui) *
        100
      : undefined;

  return (
    <Card
      variant="elevation"
      sx={{
        m: "auto",
        px: 3,
        bgcolor: "white",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Stack
          sx={{
            height: "100%",
            justifyContent: "space-evenly",
            width: 260,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <LeafIcon width={34} height={34} fill="#307731" />
              <Typography variant="h5" sx={{ color: "#324F7C" }}>
                EEOI
              </Typography>
            </Stack>
            {avgVesselBenchmark?.own.eeoi ? (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "flex-end" }}
              >
                <Typography variant="h3" sx={{ color: "primary.light" }}>
                  {avgVesselBenchmark?.own.eeoi &&
                    formatNumber(avgVesselBenchmark.own.eeoi * 1_000_000, 1)}
                </Typography>
                <Typography
                  sx={{ color: theme.palette.grey.A100, fontSize: "1.2rem" }}
                >
                  gCO2/t.nm
                </Typography>
              </Stack>
            ) : (
              <Typography
                sx={{
                  color: theme.palette.grey.A100,
                  fontSize: "1.15rem",
                }}
              >
                Ingen data
              </Typography>
            )}
            {percentEEOIChange !== undefined && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "flex-start" }}
              >
                {percentEEOIChange >= 0 ? (
                  <ArrowUpwardIcon color="error" fontSize="small" />
                ) : (
                  <ArrowDownwardIcon color="success" fontSize="small" />
                )}
                <Stack>
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      color:
                        percentEEOIChange >= 0 ? "error.main" : "success.main",
                    }}
                  >
                    {percentEEOIChange >= 0 && "+"}
                    {formatNumber(percentEEOIChange, 2)}%
                  </Typography>
                  <Typography sx={{ color: theme.palette.grey.A100 }}>
                    {`${percentEEOIChange >= 0 ? "over" : "under"} snittet for lignende fartøy`}
                  </Typography>
                </Stack>
              </Stack>
            )}
            <SparkLineChart
              data={eeoiData}
              height={100}
              area
              showHighlight
              showTooltip
              color="#9BCEDE"
              onHighlightedAxisChange={(axisItems) => {
                setTripIndex(axisItems[0]?.dataIndex ?? null);
              }}
              highlightedAxis={
                tripIndex === null
                  ? []
                  : [
                      {
                        axisId: "trip-axis",
                        dataIndex: tripIndex,
                      },
                    ]
              }
              xAxis={{
                id: "trip-axis",
                data: tripLabels,
              }}
              valueFormatter={(value) =>
                value == null
                  ? ""
                  : `${(value * 1_000_000).toFixed(4)} gCO₂/t.nm`
              }
              axisHighlight={{ x: "line" }}
              margin={{
                top: 5,
                bottom: 0,
                left: 4,
                right: 4,
              }}
              sx={{
                [`& .${lineClasses.area}`]: {
                  opacity: 0.2,
                },
                [`& .${lineClasses.line}`]: {
                  strokeWidth: 3,
                },
                [`& .${chartsAxisHighlightClasses.root}`]: {
                  strokeWidth: 2,
                },
              }}
              slotProps={{
                lineHighlight: {
                  r: 4,
                },
              }}
            />
          </Stack>
          <Divider variant="middle" />
          <Stack>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <FuiIcon width={34} height={34} fill="#307731" />
                <Typography variant="h5" sx={{ color: "#324F7C" }}>
                  FUI
                </Typography>
              </Stack>
              {avgVesselBenchmark?.own.fui ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "flex-end" }}
                >
                  <Typography variant="h3" sx={{ color: "primary.light" }}>
                    {avgVesselBenchmark?.own.fui &&
                      formatNumber(avgVesselBenchmark?.own.fui, 1)}
                  </Typography>
                  <Typography
                    sx={{ color: "primary.light", fontSize: "1.2rem" }}
                  >
                    L/tonn
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  sx={{
                    color: theme.palette.grey.A100,
                    fontSize: "1.15rem",
                  }}
                >
                  Ingen data
                </Typography>
              )}
              {percentFUIChange !== undefined && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "flex-start" }}
                >
                  {percentFUIChange >= 0 ? (
                    <ArrowUpwardIcon color="error" fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon color="success" fontSize="small" />
                  )}
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "1.05rem",
                        fontWeight: "bold",
                        color:
                          percentFUIChange >= 0 ? "error.main" : "success.main",
                      }}
                    >
                      {percentFUIChange >= 0 && "+"}
                      {formatNumber(percentFUIChange, 2)}%
                    </Typography>
                    <Typography sx={{ color: theme.palette.grey.A100 }}>
                      {`${percentFUIChange >= 0 ? "over" : "under"} snittet for lignende fartøy`}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
            <SparkLineChart
              data={fuiData}
              height={100}
              area
              showHighlight
              showTooltip
              color="#9BCEDE"
              onHighlightedAxisChange={(axisItems) => {
                setFuiTripIndex(axisItems[0]?.dataIndex ?? null);
              }}
              highlightedAxis={
                fuiTripIndex === null
                  ? []
                  : [
                      {
                        axisId: "trip-axis",
                        dataIndex: fuiTripIndex,
                      },
                    ]
              }
              xAxis={{
                id: "trip-axis",
                data: tripLabels,
              }}
              valueFormatter={(value) =>
                value == null ? "" : `${value.toFixed(2)} L/t`
              }
              axisHighlight={{ x: "line" }}
              margin={{
                top: 5,
                bottom: 0,
                left: 4,
                right: 4,
              }}
              sx={{
                [`& .${lineClasses.area}`]: {
                  opacity: 0.2,
                },
                [`& .${lineClasses.line}`]: {
                  strokeWidth: 3,
                },
                [`& .${chartsAxisHighlightClasses.root}`]: {
                  strokeWidth: 2,
                },
              }}
              slotProps={{
                lineHighlight: {
                  r: 4,
                },
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
