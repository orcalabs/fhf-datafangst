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
} from "@mui/material";
import type { FC } from "react";
import theme from "~/app/theme";
import {
  CoinStackIcon,
  FishingTripIcon,
  FishLocationIcon,
  GearIcon,
} from "~/assets/icons";
import {
  selectAvgVesselBenchmark,
  selectAvgVesselBenchmarkLoading,
  selectTripsLoading,
  useAppSelector,
} from "~/store";
import { hoursToDays, kilosOrTonsFormatter, nok } from "~/utils";

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
            <Stack
              direction="row"
              sx={{ justifyContent: "space-evenly", width: "100%" }}
            >
              <StatBox
                title="Antall turer"
                value={avgVesselBenchmark?.own.numTrips}
                icon={<FishingTripIcon width={35} height={35} />}
                change={
                  avgVesselBenchmark?.own.numTrips &&
                  avgVesselBenchmark.all.numTrips
                    ? avgVesselBenchmark.all.numTrips -
                      avgVesselBenchmark.own.numTrips
                    : undefined
                }
                changeType="number"
              />

              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Total rundvekt"
                value={
                  avgVesselBenchmark?.ownTotalLivingWeight
                    ? kilosOrTonsFormatter(
                        avgVesselBenchmark.ownTotalLivingWeight,
                      )
                    : undefined
                }
                icon={<FishLocationIcon width={35} height={35} />}
                change={
                  avgVesselBenchmark?.ownTotalLivingWeight &&
                  avgVesselBenchmark.all.livingWeight
                    ? (avgVesselBenchmark.ownTotalLivingWeight /
                        avgVesselBenchmark.all.livingWeight) *
                      100
                    : undefined
                }
                changeType="percent"
              />
              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Antall hal"
                value={avgVesselBenchmark?.own.numHauls}
                icon={<GearIcon width={35} height={35} />}
                change={
                  avgVesselBenchmark?.own.numHauls &&
                  avgVesselBenchmark.all.numHauls
                    ? avgVesselBenchmark.all.numHauls -
                      avgVesselBenchmark.own.numHauls
                    : undefined
                }
                changeType="number"
              />
              <Divider orientation="vertical" flexItem />
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
                    ? (avgVesselBenchmark.own.tripDurationSeconds /
                        avgVesselBenchmark.all.tripDurationSeconds) *
                      100
                    : undefined
                }
                changeType="percent"
              />
              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Verdi"
                value={
                  avgVesselBenchmark?.own.valueNok
                    ? nok.format(avgVesselBenchmark.own.valueNok)
                    : undefined
                }
                icon={<CoinStackIcon width={35} height={35} />}
                change={
                  avgVesselBenchmark?.own.valueNok &&
                  avgVesselBenchmark.all.valueNok
                    ? (avgVesselBenchmark.own.valueNok /
                        avgVesselBenchmark.all.valueNok) *
                      100
                    : undefined
                }
                changeType="percent"
                showAsterix={avgVesselBenchmark?.ownTripsHasPriceEstimation}
              />
            </Stack>
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
  return (
    <Stack spacing={3} sx={{ px: 3 }}>
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
            <Typography variant="h3">
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
      {change && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
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
            {change.toFixed(0)}
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
            {`${change >= 0 ? "over" : "under"} snittet for lignende fartøy`}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
