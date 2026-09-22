import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { type FC } from "react";
import theme from "~/app/theme";
import { selectAvgVesselBenchmark, useAppSelector } from "~/store";
import { kilosOrTonsFormatter } from "~/utils";
import { BenchmarkModal } from "./BenchmarkModal";
import { BenchmarkPieChart } from "./BenchmarkPieChart";

export const BenchmarkCards: FC = () => {
  const avgVesselBenchmark = useAppSelector(selectAvgVesselBenchmark);

  return (
    <Grid container spacing={3} sx={{ pt: 3 }}>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Total fangstvekt"
            value={avgVesselBenchmark?.ownAverageLivingWeight}
            max={avgVesselBenchmark?.highestAverageLivingWeight}
            innerText={
              avgVesselBenchmark && avgVesselBenchmark.ownAverageLivingWeight
                ? kilosOrTonsFormatter(
                    avgVesselBenchmark?.ownAverageLivingWeight,
                  )
                : ""
            }
          />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box>
          <BenchmarkPieChart
            title="Fangst per time"
            value={avgVesselBenchmark?.ownAverageWeightPerHour}
            max={avgVesselBenchmark?.highestAverageWeightPerHour}
            innerText={
              avgVesselBenchmark && avgVesselBenchmark.ownAverageWeightPerHour
                ? kilosOrTonsFormatter(
                    avgVesselBenchmark?.ownAverageWeightPerHour,
                    undefined,
                    "/time",
                  )
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
            innerText={
              avgVesselBenchmark &&
              avgVesselBenchmark.ownAverageWeightPerDistance
                ? kilosOrTonsFormatter(
                    avgVesselBenchmark?.ownAverageWeightPerDistance,
                    2,
                    "/nm",
                  )
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
            innerText={
              avgVesselBenchmark?.ownAverageFuelConsumptionLiter
                ?.toFixed(0)
                .toString() + " l/tur"
            }
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
            innerText={
              avgVesselBenchmark?.ownAverageWeightPerFuelLiter
                ?.toFixed(1)
                .toString() + " kg/l"
            }
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
            innerText={avgVesselBenchmark?.ownAverageCatchValuePerFuelLiter
              ?.toFixed(1)
              .toString()}
            color={theme.palette.grey.A400}
          />
        </Box>
      </Grid>

      <BenchmarkModal />
    </Grid>
  );
};
