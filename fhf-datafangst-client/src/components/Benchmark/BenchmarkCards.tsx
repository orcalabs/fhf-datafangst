import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { type FC } from "react";
import theme from "~/app/theme";
import {
  CalendarFishIcon,
  FishLocationIcon,
  FishPerDistanceIcon,
  FishValuePerFuelIcon,
  ValuePerFuelIcon,
} from "~/assets/icons";
import { selectAvgVesselBenchmark, useAppSelector } from "~/store";
import { formatNumber } from "~/utils";
import { GaugeChart } from "./GaugeChart";

export const BenchmarkCards: FC = () => {
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);

  return (
    <Grid container spacing={3}>
      <Grid size={4}>
        <Box>
          <GaugeChart
            title="Fangst, rundvekt"
            value={avgVesselBenchmark?.own.livingWeight}
            icon={<FishLocationIcon width={34} height={34} />}
            max={avgVesselBenchmark?.highestAverageLivingWeight}
            valueText={
              avgVesselBenchmark?.own.livingWeight
                ? avgVesselBenchmark.own.livingWeight >= 1000
                  ? formatNumber(avgVesselBenchmark.own.livingWeight / 1000, 1)
                  : formatNumber(avgVesselBenchmark?.own.livingWeight, 1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.livingWeight
                ? avgVesselBenchmark.own.livingWeight >= 1000
                  ? "tonn/tur"
                  : "kg"
                : ""
            }
            averagePercent={
              avgVesselBenchmark?.all.livingWeight &&
              avgVesselBenchmark?.own.livingWeight
                ? ((avgVesselBenchmark.own.livingWeight -
                    avgVesselBenchmark.all.livingWeight) /
                    avgVesselBenchmark.all.livingWeight) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <GaugeChart
            title="Fangst per dag"
            value={avgVesselBenchmark?.own.weightPerHour}
            icon={<CalendarFishIcon width={34} height={34} />}
            max={avgVesselBenchmark?.highestAverageWeightPerHour}
            valueText={
              avgVesselBenchmark?.own.weightPerHour
                ? avgVesselBenchmark.own.weightPerHour >= 1000
                  ? formatNumber(
                      (avgVesselBenchmark.own.weightPerHour * 24) / 1000,
                      1,
                    )
                  : formatNumber(avgVesselBenchmark.own.weightPerHour * 24, 1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.weightPerHour
                ? avgVesselBenchmark.own.weightPerHour >= 1000
                  ? "tonn/dag"
                  : "kg/dag"
                : ""
            }
            averagePercent={
              avgVesselBenchmark?.all.weightPerHour &&
              avgVesselBenchmark?.own.weightPerHour
                ? ((avgVesselBenchmark.own.weightPerHour -
                    avgVesselBenchmark.all.weightPerHour) /
                    avgVesselBenchmark.all.weightPerHour) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <GaugeChart
            title="Fangst per distanse"
            value={avgVesselBenchmark?.own.weightPerDistance}
            icon={<FishPerDistanceIcon width={34} height={34} />}
            max={avgVesselBenchmark?.highestAverageWeightPerDistance}
            valueText={
              avgVesselBenchmark?.own.weightPerDistance
                ? avgVesselBenchmark.own.weightPerDistance >= 1000
                  ? formatNumber(
                      avgVesselBenchmark.own.weightPerDistance / 1000,
                      1,
                    )
                  : formatNumber(avgVesselBenchmark.own.weightPerDistance, 1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.weightPerDistance
                ? avgVesselBenchmark.own.weightPerDistance >= 1000
                  ? "tonn"
                  : "kg/nm"
                : ""
            }
            averagePercent={
              avgVesselBenchmark?.all.weightPerDistance &&
              avgVesselBenchmark?.own.weightPerDistance
                ? ((avgVesselBenchmark.own.weightPerDistance -
                    avgVesselBenchmark.all.weightPerDistance) /
                    avgVesselBenchmark.all.weightPerDistance) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <GaugeChart
            title="Drivstofforbruk"
            value={avgVesselBenchmark?.own.fuelConsumptionLiter}
            icon={<LocalGasStationIcon sx={{ width: 34, height: 34 }} />}
            max={avgVesselBenchmark?.highestAverageFuelConsumptionLiter}
            suffix={"liter/tur"}
            precision={0}
            color={theme.palette.grey.A400}
            inverse
            averagePercent={
              avgVesselBenchmark?.all.fuelConsumptionLiter &&
              avgVesselBenchmark?.own.fuelConsumptionLiter
                ? ((avgVesselBenchmark.own.fuelConsumptionLiter -
                    avgVesselBenchmark.all.fuelConsumptionLiter) /
                    avgVesselBenchmark.all.fuelConsumptionLiter) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <GaugeChart
            title="Fangstvekt per liter drivstoff"
            value={avgVesselBenchmark?.own.weightPerFuelLiter}
            icon={<FishValuePerFuelIcon width={34} height={34} />}
            max={avgVesselBenchmark?.highestAverageWeightPerFuelLiter}
            suffix={"kg/liter"}
            color={theme.palette.grey.A400}
            averagePercent={
              avgVesselBenchmark?.all.weightPerFuelLiter &&
              avgVesselBenchmark?.own.weightPerFuelLiter
                ? ((avgVesselBenchmark.own.weightPerFuelLiter -
                    avgVesselBenchmark.all.weightPerFuelLiter) /
                    avgVesselBenchmark.all.weightPerFuelLiter) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <GaugeChart
            icon={<ValuePerFuelIcon width={34} height={34} />}
            title="Fangstverdi per liter drivstoff"
            value={avgVesselBenchmark?.own.catchValuePerFuelLiter}
            max={avgVesselBenchmark?.highestAverageCatchValuePerFuelLiter}
            suffix={"kr/liter"}
            color={theme.palette.grey.A400}
            averagePercent={
              avgVesselBenchmark?.all.catchValuePerFuelLiter &&
              avgVesselBenchmark?.own.catchValuePerFuelLiter
                ? ((avgVesselBenchmark.own.catchValuePerFuelLiter -
                    avgVesselBenchmark.all.catchValuePerFuelLiter) /
                    avgVesselBenchmark.all.catchValuePerFuelLiter) *
                  100
                : undefined
            }
          />
        </Box>
      </Grid>
    </Grid>
  );
};
