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
            value={avgVesselBenchmark?.own.livingWeight}
            max={avgVesselBenchmark?.highestAverageLivingWeight}
            valueText={
              avgVesselBenchmark?.own.livingWeight
                ? avgVesselBenchmark.own.livingWeight >= 1000
                  ? (avgVesselBenchmark.own.livingWeight / 1000).toFixed(1)
                  : avgVesselBenchmark?.own.livingWeight?.toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.livingWeight
                ? avgVesselBenchmark.own.livingWeight >= 1000
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
            value={avgVesselBenchmark?.own.weightPerHour}
            max={avgVesselBenchmark?.highestAverageWeightPerHour}
            valueText={
              avgVesselBenchmark?.own.weightPerHour
                ? avgVesselBenchmark.own.weightPerHour >= 1000
                  ? (
                      (avgVesselBenchmark.own.weightPerHour * 24) /
                      1000
                    ).toFixed(1)
                  : (avgVesselBenchmark.own.weightPerHour * 24).toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.weightPerHour
                ? avgVesselBenchmark.own.weightPerHour >= 1000
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
            value={avgVesselBenchmark?.own.weightPerDistance}
            max={avgVesselBenchmark?.highestAverageWeightPerDistance}
            valueText={
              avgVesselBenchmark?.own.weightPerDistance
                ? avgVesselBenchmark.own.weightPerDistance >= 1000
                  ? (avgVesselBenchmark.own.weightPerDistance / 1000).toFixed(1)
                  : avgVesselBenchmark.own.weightPerDistance.toFixed(1)
                : ""
            }
            suffix={
              avgVesselBenchmark?.own.weightPerDistance
                ? avgVesselBenchmark.own.weightPerDistance >= 1000
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
            value={avgVesselBenchmark?.own.fuelConsumptionLiter}
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
            value={avgVesselBenchmark?.own.weightPerFuelLiter}
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
            value={avgVesselBenchmark?.own.catchValuePerFuelLiter}
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
