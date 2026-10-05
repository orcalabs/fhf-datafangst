import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { type FC } from "react";
import theme from "~/app/theme";
import { selectAvgVesselBenchmark, useAppSelector } from "~/store";
import { BenchmarkModal } from "./BenchmarkModal";
import { BenchmarkPieChart } from "./BenchmarkPieChart";

export const BenchmarkCards: FC = () => {
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);

  return (
    <Grid container spacing={3}>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Total fangstvekt"
            value={avgVesselBenchmark?.ownAverageLivingWeight}
            max={avgVesselBenchmark?.highestAverageLivingWeight}
            valueText={
              avgVesselBenchmark?.ownAverageLivingWeight
                ? avgVesselBenchmark.ownAverageLivingWeight >= 1000
                  ? (avgVesselBenchmark.ownAverageLivingWeight / 1000).toFixed(
                      1,
                    )
                  : avgVesselBenchmark?.ownAverageLivingWeight?.toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.ownAverageLivingWeight
                ? avgVesselBenchmark.ownAverageLivingWeight >= 1000
                  ? "tonn/tur"
                  : "kg"
                : ""
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Fangst per dag"
            value={avgVesselBenchmark?.ownAverageWeightPerHour}
            max={avgVesselBenchmark?.highestAverageWeightPerHour}
            valueText={
              avgVesselBenchmark?.ownAverageWeightPerHour
                ? avgVesselBenchmark.ownAverageWeightPerHour >= 1000
                  ? (
                      (avgVesselBenchmark.ownAverageWeightPerHour * 24) /
                      1000
                    ).toFixed(1)
                  : (avgVesselBenchmark.ownAverageWeightPerHour * 24).toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.ownAverageWeightPerHour
                ? avgVesselBenchmark.ownAverageWeightPerHour >= 1000
                  ? "tonn/dag"
                  : "kg/dag"
                : ""
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Fangst per distanse"
            value={avgVesselBenchmark?.ownAverageWeightPerDistance}
            max={avgVesselBenchmark?.highestAverageWeightPerDistance}
            valueText={
              avgVesselBenchmark?.ownAverageWeightPerDistance
                ? avgVesselBenchmark.ownAverageWeightPerDistance >= 1000
                  ? (
                      avgVesselBenchmark.ownAverageWeightPerDistance / 1000
                    ).toFixed(1)
                  : avgVesselBenchmark.ownAverageWeightPerDistance.toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.ownAverageWeightPerDistance
                ? avgVesselBenchmark.ownAverageWeightPerDistance >= 1000
                  ? "tonn"
                  : "kg/nm"
                : ""
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Drivstofforbruk"
            value={avgVesselBenchmark?.ownAverageFuelConsumptionLiter}
            max={avgVesselBenchmark?.highestAverageFuelConsumptionLiter}
            suffix={"liter/tur"}
            precision={0}
            color={theme.palette.grey.A400}
            inverse
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Fangstvekt per liter drivstoff"
            value={avgVesselBenchmark?.ownAverageWeightPerFuelLiter}
            max={avgVesselBenchmark?.highestAverageWeightPerFuelLiter}
            suffix={"kg/liter"}
            color={theme.palette.grey.A400}
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Fangstverdi per liter drivstoff"
            value={avgVesselBenchmark?.ownAverageCatchValuePerFuelLiter}
            max={avgVesselBenchmark?.highestAverageCatchValuePerFuelLiter}
            suffix={"kr/liter"}
            color={theme.palette.grey.A400}
          />
        </Box>
      </Grid>

      <BenchmarkModal />
    </Grid>
  );
};
