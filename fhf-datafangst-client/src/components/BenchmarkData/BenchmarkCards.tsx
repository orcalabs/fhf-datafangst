import { FC } from "react";

import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectTrips, useAppDispatch, useAppSelector } from "store";
import { Grid } from "@mui/material";
import {
  BenchmarkModalParams,
  selectBenchmarkNumHistoric,
  setBenchmarkHistoric,
  setBenchmarkModal,
} from "store/benchmark";
import { Trip } from "generated/openapi";
import { BenchmarkModal } from "./BenchmarkModal";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhishingRoundedIcon from "@mui/icons-material/PhishingRounded";

const getTotalTimes = (trips: Trip[]) =>
  trips.map(
    (t) =>
      (new Date(t.end).getTime() - new Date(t.start).getTime()) / 3_600_000,
  );

const getFishingHours = (trips: Trip[]) =>
  trips.map((t) =>
    t.hauls.reduce(
      (tot, h) =>
        tot +
        (new Date(h.stopTimestamp).getTime() -
          new Date(h.startTimestamp).getTime()) /
          3_600_000,
      0,
    ),
  );

const getFishingDistance = (trips: Trip[]) =>
  trips.map((t) => t.hauls.reduce((tot, h) => tot + (h.haulDistance ?? 0), 0));

const getFishingWeight = (trips: Trip[]) =>
  trips.map((t) => t.delivery.totalLivingWeight);

const getTripDates = (trips: Trip[]) => trips.map((t) => t.start);

enum BenchmarkType {
  totalTime,
  fishingHours,
  fishingDistance,
  fishingWeight,
}

export const BenchmarkCards: FC = () => {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const numHistoric = useAppSelector(selectBenchmarkNumHistoric);
  if (!trips) {
    return <></>;
  }

  const totalTimes = getTotalTimes(trips);
  const fishingHours = getFishingHours(trips);
  const fishingDistance = getFishingDistance(trips);
  const fishingWeight = getFishingWeight(trips);
  const totalTimeMean =
    totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length;
  const fishingHoursMean =
    fishingHours.reduce((a, b) => a + b, 0) / fishingHours.length;
  const fishingDistanceMean =
    fishingDistance.reduce((a, b) => a + b, 0) / fishingDistance.length;
  const fishingWeightMean =
    fishingWeight.reduce((a, b) => a + b, 0) / fishingWeight.length;

  const handleClick = (type: BenchmarkType) => {
    const benchmarkModal: BenchmarkModalParams = {};
    let data: number[];
    let metric: string;
    if (type === BenchmarkType.totalTime) {
      benchmarkModal.title = "Total tid";
      benchmarkModal.description =
        "Total tid er regnet som tiden mellom havneavgang og havneanløp.";
      metric = totalTimeMean > 24 ? "Dager" : "Timer";
      data =
        totalTimeMean > 24 ? totalTimes.map((value) => value / 24) : totalTimes;
    } else if (type === BenchmarkType.fishingHours) {
      benchmarkModal.title = "Fiske tid";
      benchmarkModal.description =
        "Fiske tid er regnet som summen av tiden brukt under hver fangstmelding.";
      metric = totalTimeMean > 24 ? "Dager" : "Timer";
      data =
        fishingHoursMean > 24
          ? fishingHours.map((value) => value / 24)
          : fishingHours;
    } else if (type === BenchmarkType.fishingDistance) {
      benchmarkModal.title = "Fiske distanse";
      benchmarkModal.description =
        "Fiske distanse er regnet ut basert på vms/ais meldingene som ble sendt under hver fangstmelding";
      metric = fishingDistanceMean > 1852 ? "Nautisk Mil" : "Meter";
      data =
        fishingDistanceMean > 1852
          ? fishingDistance.map((value) => value / 1852)
          : fishingDistance;
    } else if (type === BenchmarkType.fishingWeight) {
      benchmarkModal.title = "Total vekt";
      benchmarkModal.description = "Total vekt er basert på total landet vekt";
      metric = fishingWeightMean > 1000 ? "Tonn" : "Kilo";
      data =
        fishingWeightMean > 1000
          ? fishingWeight.map((value) => value / 1000)
          : fishingWeight;
    } else {
      return;
    }
    dispatch(
      setBenchmarkHistoric({ metric, xAxis: getTripDates(trips), data }),
    );
    dispatch(setBenchmarkModal(benchmarkModal));
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ marginTop: "3vh", backgroundColor: "primary.main" }}
    >
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total tid"
            avatar={<AccessTimeIcon />}
            value={totalTimeMean > 24 ? totalTimes[0] / 24 : totalTimes[0]}
            description="Siste tur"
            primary_color={
              totalTimes[0] > totalTimeMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={
              totalTimeMean > 24 ? totalTimeMean / 24 : totalTimeMean
            }
            secondary_description={
              "Gjennomsnitt siste " + numHistoric.toString() + " turer"
            }
            metric={totalTimeMean > 24 ? "Dager" : "Timer"}
            tooltip="Regnet ut basert på dine por og dep meldinger."
            onClick={() => handleClick(BenchmarkType.totalTime)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiske tid"
            avatar={<PhishingRoundedIcon />}
            value={
              fishingHoursMean > 24 ? fishingHours[0] / 24 : fishingHours[0]
            }
            description="Siste tur"
            primary_color={
              fishingHours[0] > fishingHoursMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={
              fishingHoursMean > 24 ? fishingHoursMean / 24 : fishingHoursMean
            }
            secondary_description={
              "Gjennomsnitt siste " + numHistoric.toString() + " turer"
            }
            metric={fishingHoursMean > 24 ? "Dager" : "Timer"}
            tooltip="Regnet ut basert på dine fangstmeldinger."
            onClick={() => handleClick(BenchmarkType.fishingHours)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiske distanse"
            avatar={<StraightenRoundedIcon />}
            value={
              fishingDistanceMean > 1852
                ? fishingDistance[0] / 1852
                : fishingDistance[0]
            }
            description="Siste tur"
            primary_color={
              fishingDistance[0] > fishingDistanceMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={
              fishingDistanceMean > 1852
                ? fishingDistanceMean / 1852
                : fishingDistanceMean
            }
            secondary_description={
              "Gjennomsnitt siste " + numHistoric.toString() + " turer"
            }
            metric={fishingDistanceMean > 1852 ? "Nautisk Mil" : "Meter"}
            tooltip="Regnet ut basert på dine fangstmeldinger."
            onClick={() => handleClick(BenchmarkType.fishingDistance)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total vekt"
            avatar={<ScaleRoundedIcon />}
            value={
              fishingWeightMean > 1000
                ? fishingWeight[0] / 1000
                : fishingWeight[0]
            }
            description="Siste tur"
            primary_color={
              fishingWeight[0] > fishingWeightMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={
              fishingWeightMean > 1000
                ? fishingWeightMean / 1000
                : fishingWeightMean
            }
            secondary_description={
              "Gjennomsnitt siste " + numHistoric.toString() + " turer"
            }
            metric={fishingWeightMean > 1000 ? "Tonn" : "Kilo"}
            tooltip="Data basert på levert vekt."
            onClick={() => handleClick(BenchmarkType.fishingWeight)}
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};
