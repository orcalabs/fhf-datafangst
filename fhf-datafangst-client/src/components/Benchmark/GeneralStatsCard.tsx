import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { FC } from "react";
import theme from "~/app/theme";
import { CoinStackIcon, FishingTripIcon, GearIcon } from "~/assets/icons";
import { VesselRankingType } from "~/models";
import {
  selectAvgVesselBenchmark,
  selectAvgVesselBenchmarkLoading,
  selectTripsLoading,
  selectVesselRankingType,
  useAppSelector,
} from "~/store";
import { formatNumber, hoursToDays, nokCompact } from "~/utils";

export const GeneralStatsCard: FC = () => {
  const isLoading = useAppSelector(selectAvgVesselBenchmarkLoading);
  const tripsLoading = useAppSelector(selectTripsLoading);
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);

  return (
    <>
      <Card
        variant="elevation"
        sx={{
          m: "auto",
          borderRadius: 2,
          width: "100%",
          color: "#243a9c",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            height: "100%",
            pt: 3,
          }}
        >
          {isLoading || tripsLoading ? (
            <Skeleton variant="rectangular" width={"100%"} height={74} />
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "stretch" }}>
                <StatBox
                  title="Antall turer"
                  value={avgVesselBenchmark?.own.numTrips}
                  icon={<FishingTripIcon width={35} height={35} />}
                  change={
                    avgVesselBenchmark?.own.numTrips &&
                    avgVesselBenchmark.all.numTrips
                      ? avgVesselBenchmark.own.numTrips -
                        avgVesselBenchmark.all.numTrips
                      : undefined
                  }
                  changeType="number"
                />
                <Divider orientation="vertical" flexItem />
              </Box>
              <Box sx={{ display: "flex", alignItems: "stretch" }}>
                <StatBox
                  title="Antall hal"
                  value={avgVesselBenchmark?.own.numHauls}
                  icon={<GearIcon width={35} height={35} />}
                  change={
                    avgVesselBenchmark?.own.numHauls &&
                    avgVesselBenchmark.all.numHauls
                      ? avgVesselBenchmark.own.numHauls -
                        avgVesselBenchmark.all.numHauls
                      : undefined
                  }
                  changeType="number"
                />
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", lg: "block" } }}
                />
              </Box>
              <Box
                sx={{
                  display: { xs: "contents", lg: "none" },
                }}
              >
                <Divider sx={{ gridColumn: "1", mr: 3 }} />
                <Divider sx={{ gridColumn: "2" }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "stretch" }}>
                <StatBox
                  title="Dager brukt"
                  value={
                    avgVesselBenchmark?.own.tripDurationSeconds
                      ? hoursToDays(
                          avgVesselBenchmark.own.tripDurationSeconds / 3600,
                        )
                      : undefined
                  }
                  icon={<TimerOutlinedIcon fontSize="large" />}
                  change={
                    avgVesselBenchmark?.own.tripDurationSeconds &&
                    avgVesselBenchmark.all.tripDurationSeconds
                      ? ((avgVesselBenchmark.own.tripDurationSeconds -
                          avgVesselBenchmark.all.tripDurationSeconds) /
                          avgVesselBenchmark.all.tripDurationSeconds) *
                        100
                      : undefined
                  }
                  changeType="percent"
                />
                <Divider orientation="vertical" flexItem />
              </Box>
              <Box sx={{ display: "flex", alignItems: "stretch" }}>
                <StatBox
                  title="Verdi"
                  value={
                    avgVesselBenchmark?.own.valueNok
                      ? nokCompact.format(avgVesselBenchmark.own.valueNok)
                      : undefined
                  }
                  icon={<CoinStackIcon width={35} height={35} />}
                  change={
                    avgVesselBenchmark?.own.valueNok &&
                    avgVesselBenchmark.all.valueNok
                      ? ((avgVesselBenchmark.own.valueNok -
                          avgVesselBenchmark.all.valueNok) /
                          avgVesselBenchmark.all.valueNok) *
                        100
                      : undefined
                  }
                  changeType="percent"
                  showAsterix={avgVesselBenchmark?.ownTripsHasPriceEstimation}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

interface StatProps {
  title: string;
  value?: number | string | null | undefined;
  suffix?: string;
  icon?: any;
  change?: number;
  changeType?: "percent" | "number";
  showAsterix?: boolean | null;
}

const StatBox: FC<StatProps> = ({
  title,
  value,
  suffix,
  icon,
  change,
  changeType,
  showAsterix,
}) => {
  const vesselRankingType = useAppSelector(selectVesselRankingType);
  const useSmallerText = useMediaQuery(theme.breakpoints.between("lg", 2200));

  return (
    <Stack spacing={3} sx={{ px: 3, flex: 1 }}>
      <Stack direction="row" spacing={2}>
        <Box>{icon}</Box>

        <Stack spacing={1}>
          <Typography sx={{ color: "#757d81" }}>{title}</Typography>
          <Tooltip
            title={
              showAsterix
                ? "* Hele eller deler av beløpet baseres på estimerte verdier fra ukentlig salgsdata fra Råfisklaget"
                : undefined
            }
          >
            <Typography
              variant="h3"
              sx={{ fontSize: useSmallerText ? "1.8rem" : "2.25rem" }}
            >
              <Box component="span">{value ?? "Ukjent"}</Box>
              <Typography component="span" sx={{ whiteSpace: "nowrap" }}>
                {suffix ?? ""}{" "}
                {showAsterix && (
                  <Box
                    component="span"
                    sx={{
                      fontSize: "1.2rem",
                      verticalAlign: "top",
                      color: theme.palette.error.main,
                    }}
                  >
                    *
                  </Box>
                )}
              </Typography>
            </Typography>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        {change !== undefined ? (
          <>
            {change >= 0 ? (
              <ArrowUpwardIcon color="success" fontSize="small" />
            ) : (
              <ArrowDownwardIcon color="error" fontSize="small" />
            )}
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                color: change >= 0 ? "success.main" : "error.main",
              }}
            >
              {change >= 0 && "+"}
              {formatNumber(change)}
              {changeType === "percent" && "%"}
            </Typography>
            <Typography
              sx={{
                alignSelf: "flex-end",
                color: theme.palette.grey.A100,
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              {`${change >= 0 ? "over" : "under"} snittet for ${vesselRankingType === VesselRankingType.Similar ? "lignende" : "fulgte"} fartøy`}
            </Typography>
          </>
        ) : (
          <Typography
            sx={{
              alignSelf: "flex-end",
              color: theme.palette.grey.A100,
              flex: "1 1 auto",
              minWidth: 0,
              fontStyle: "italic",
            }}
          >
            Ingen sammenligningsgrunnlag
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
