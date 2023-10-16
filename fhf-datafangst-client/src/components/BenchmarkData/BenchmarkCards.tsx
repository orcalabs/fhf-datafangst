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
import { createDurationFromHours } from "utils";

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
  TotalTime,
  FishingHours,
  FishingDistance,
  FishingWeight,
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
    if (type === BenchmarkType.TotalTime) {
      benchmarkModal.title = "Total tid";
      benchmarkModal.description =
        "Total tid er regnet som tiden mellom havneavgang og havneanløp.";
      metric = totalTimeMean > 24 ? "Dager" : "Timer";
      data =
        totalTimeMean > 24 ? totalTimes.map((value) => value / 24) : totalTimes;
    } else if (type === BenchmarkType.FishingHours) {
      benchmarkModal.title = "Fiske tid";
      benchmarkModal.description =
        "Fiske tid er regnet som summen av tiden brukt under hver fangstmelding.";
      metric = totalTimeMean > 24 ? "Dager" : "Timer";
      data =
        fishingHoursMean > 24
          ? fishingHours.map((value) => value / 24)
          : fishingHours;
    } else if (type === BenchmarkType.FishingDistance) {
      benchmarkModal.title = "Fiske distanse";
      benchmarkModal.description =
        "Fiske distanse er regnet ut basert på vms/ais meldingene som ble sendt under hver fangstmelding";
      metric = fishingDistanceMean > 1852 ? "Nautisk Mil" : "Meter";
      data =
        fishingDistanceMean > 1852
          ? fishingDistance.map((value) => value / 1852)
          : fishingDistance;
    } else if (type === BenchmarkType.FishingWeight) {
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
            avatar={<AccessTimeIcon sx={{color : "text.secondary" }}/>}
            value={createDurationFromHours(totalTimes[0])}
            description="Siste tur"
            primary_color={
              totalTimes[0] > totalTimeMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(totalTimeMean)}
            secondary_description={
              "Gjennomsnitt siste " + totalTimes.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine por og dep meldinger."
            onClick={() => handleClick(BenchmarkType.TotalTime)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiske tid"
            avatar={<PhishingRoundedIcon sx={{color : "text.secondary" }} />}
            value={createDurationFromHours(fishingHours[0])}
            description="Siste tur"
            primary_color={
              fishingHours[0] > fishingHoursMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(fishingHoursMean)}
            secondary_description={
              "Gjennomsnitt siste " + fishingHours.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine fangstmeldinger."
            onClick={() => handleClick(BenchmarkType.FishingHours)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiske distanse"
            avatar={<StraightenRoundedIcon sx={{color : "text.secondary" }} />}
            value={(fishingDistanceMean > 1852
              ? fishingDistance[0] / 1852
              : fishingDistance[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              fishingDistance[0] > fishingDistanceMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(fishingDistanceMean > 1852
              ? fishingDistanceMean / 1852
              : fishingDistanceMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " + fishingDistance.length.toString() + " turer"
            }
            metric={fishingDistanceMean > 1852 ? "Nautisk Mil" : "Meter"}
            tooltip="Regnet ut basert på dine fangstmeldinger."
            onClick={() => handleClick(BenchmarkType.FishingDistance)}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total vekt"
            avatar={<ScaleRoundedIcon sx={{color : "text.secondary" }} />}
            value={(fishingWeightMean > 1000
              ? fishingWeight[0] / 1000
              : fishingWeight[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              fishingWeight[0] > fishingWeightMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(fishingWeightMean > 1000
              ? fishingWeightMean / 1000
              : fishingWeightMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " + fishingWeight.length.toString() + " turer"
            }
            metric={fishingWeightMean > 1000 ? "Tonn" : "Kilo"}
            tooltip="Data basert på levert vekt."
            onClick={() => handleClick(BenchmarkType.FishingWeight)}
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};
