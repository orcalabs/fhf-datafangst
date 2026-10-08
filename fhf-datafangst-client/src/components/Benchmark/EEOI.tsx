import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import { lineClasses } from "@mui/x-charts/LineChart";
import { useState, type FC } from "react";
import type {
  AverageVesselsBenchmarks,
  Trip,
  TripBenchmarks,
} from "~/generated/openapi";
import { dateFormat } from "~/utils";

interface Props {
  avgVesselBenchmark?: AverageVesselsBenchmarks;
  tripBenchmarks?: TripBenchmarks;
  trips?: Trip[];
}

export const EEOI: FC<Props> = ({
  avgVesselBenchmark,
  tripBenchmarks,
  trips,
}) => {
  const [tripIndex, setTripIndex] = useState<number | null>(null);
  const [fuiTripIndex, setFuiTripIndex] = useState<number | null>(null);

  const eeoiData = tripBenchmarks?.trips.map((trip) => trip.eeoi ?? 0) ?? [];
  const fuiData =
    trips?.map((trip) =>
      trip.fuelConsumption && trip.delivery.totalLivingWeight
        ? trip.fuelConsumption / trip.delivery.totalLivingWeight
        : 0,
    ) ?? [];

  const tripLabels = tripBenchmarks?.trips.map(
    (trip) =>
      `Tur: ${dateFormat(trip.start, "d/M/y")} – ${dateFormat(trip.end, "d/M/y")}`,
  );

  const fuiLabels = trips?.map(
    (trip) =>
      `Tur: ${dateFormat(trip.start, "d/M/y")} – ${dateFormat(trip.end, "d/M/y")}`,
  );

  const percentEEOIChange =
    avgVesselBenchmark?.own.eeoi != null && avgVesselBenchmark?.all.eeoi != null
      ? -(
          (avgVesselBenchmark?.own.eeoi - avgVesselBenchmark?.all.eeoi) /
          avgVesselBenchmark?.all.eeoi
        ) * 100
      : undefined;

  const percentFUIChange =
    avgVesselBenchmark?.own.fui != null && avgVesselBenchmark?.all.fui != null
      ? -(
          (avgVesselBenchmark?.own.fui - avgVesselBenchmark?.all.fui) /
          avgVesselBenchmark?.all.fui
        ) * 100
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
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ color: "grey" }}>
              EEOI
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
              <Typography variant="h3" sx={{ color: "primary.light" }}>
                {(
                  avgVesselBenchmark?.own.eeoi &&
                  avgVesselBenchmark.own.eeoi * 1_000_000
                )?.toFixed(2)}
              </Typography>
              <Typography sx={{ color: "primary.light", fontSize: "1.2rem" }}>
                gCO2/t.nm
              </Typography>
            </Stack>
            {percentEEOIChange && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {percentEEOIChange >= 0 ? (
                  <ArrowUpwardIcon color="success" fontSize="small" />
                ) : (
                  <ArrowDownwardIcon color="error" fontSize="small" />
                )}
                <Typography
                  sx={{
                    fontSize: "1.05rem",
                    color:
                      percentEEOIChange >= 0 ? "success.main" : "error.main",
                  }}
                >
                  {percentEEOIChange.toFixed(2)}%
                </Typography>
              </Stack>
            )}
            <SparkLineChart
              data={eeoiData}
              height={60}
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
              <Typography variant="h5" sx={{ color: "grey" }}>
                FUI
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "flex-end" }}
              >
                <Typography variant="h3" sx={{ color: "primary.light" }}>
                  {avgVesselBenchmark?.own.fui?.toFixed(2)}
                </Typography>
                <Typography sx={{ color: "primary.light", fontSize: "1.2rem" }}>
                  L/tonn
                </Typography>
              </Stack>
              {percentFUIChange && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  {percentFUIChange >= 0 ? (
                    <ArrowUpwardIcon color="success" fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon color="error" fontSize="small" />
                  )}
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      color:
                        percentFUIChange >= 0 ? "success.main" : "error.main",
                    }}
                  >
                    {percentFUIChange.toFixed(2)} %
                  </Typography>
                </Stack>
              )}
            </Stack>
            <SparkLineChart
              data={fuiData}
              height={60}
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
                data: fuiLabels,
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
