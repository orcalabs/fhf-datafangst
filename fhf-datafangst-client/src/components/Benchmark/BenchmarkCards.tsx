import { FC } from "react";
import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectBwUserProfile, selectTrips, selectVesselsByFiskeridirId, useAppDispatch, useAppSelector } from "store";
import { Grid } from "@mui/material";
import { BenchmarkModalParams, selectBenchmarkTrips, setBenchmarkModal } from "store/benchmark";
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
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);
  const followTrips = useAppSelector(selectBenchmarkTrips)
  const followTripsList = Object.values(followTrips).reduce((acc: Trip[], pre: Trip[]) => [...pre, ...acc], []);
  console.log(followTripsList)

  const trips = useAppSelector(selectTrips);
  if (!trips) {
    return <></>;
  }

  const myTotalTimes = getTotalTimes(trips);
  const myFishingHours = getFishingHours(trips);
  const myFishingDistance = getFishingDistance(trips);
  const myFishingWeight = getFishingWeight(trips);
  const myTotalTimeMean =
  myTotalTimes.reduce((a, b) => a + b, 0) / myTotalTimes.length;
  const myFishingHoursMean =
  myFishingHours.reduce((a, b) => a + b, 0) / myFishingHours.length;
  const myFishingDistanceMean =
  myFishingDistance.reduce((a, b) => a + b, 0) / myFishingDistance.length;
  const myFishingWeightMean =
  myFishingWeight.reduce((a, b) => a + b, 0) / myFishingWeight.length;
  
  const followTotalTimes = getTotalTimes(followTripsList);
  const followFishingHours = getFishingHours(followTripsList);
  const followFishingDistance = getFishingDistance(followTripsList);
  const followFishingWeight = getFishingWeight(followTripsList);
  const followTotalTimeMean =
  followTotalTimes.reduce((a, b) => a + b, 0) / followTotalTimes.length;
  const followFishingHoursMean =
  followFishingHours.reduce((a, b) => a + b, 0) / followFishingHours.length;
  const followFishingDistanceMean =
  followFishingDistance.reduce((a, b) => a + b, 0) / followFishingDistance.length;
  const followFishingWeightMean =
  followFishingWeight.reduce((a, b) => a + b, 0) / followFishingWeight.length;



  const xAxis = getTripDates(trips);
  const modalParams: Record<BenchmarkType, BenchmarkModalParams> = {
    [BenchmarkType.TotalTime]: {
      title: "Total tid",
      description:
        "Total tid er regnet som tiden mellom havneavgang og havneanløp.",
      yAxis:
        myTotalTimeMean > 24
          ? myTotalTimes.map((t) => Number((t / 24).toFixed(2)))
          : myTotalTimes.map((t) => Number(t.toFixed(2))),
      metric: myTotalTimeMean > 24 ? "Dager" : "Timer",
      xAxis,
    },
    [BenchmarkType.FishingHours]: {
      title: "Fisketid",
      description:
        "Fisketid er regnet som summen av tiden brukt under hver fangstmelding.",
      metric: myFishingHoursMean > 24 ? "Dager" : "Timer",
      yAxis:
        myFishingHoursMean > 24
          ? myFishingHours.map((t) => Number((t / 24).toFixed(2)))
          : myFishingHours.map((t) => Number(t.toFixed(2))),
      xAxis,
    },

    [BenchmarkType.FishingDistance]: {
      title: "Fiskedistanse",
      description:
        "Fiskedistanse er regnet ut basert på VMS og AIS-meldingene som ble sendt under hver fangstmelding.",
      metric: myFishingDistanceMean > 1852 ? "Nautiske mil" : "Meter",
      yAxis:
        myFishingDistanceMean > 1852
          ? myFishingDistance.map((d) => Number((d / 1852).toFixed(2)))
          : myFishingDistance.map((d) => Number(d.toFixed(2))),
      xAxis,
    },
    [BenchmarkType.FishingWeight]: {
      title: "Total vekt",
      description: "Total vekt er basert på total landet vekt",
      metric: myFishingWeightMean > 1000 ? "Tonn" : "Kilo",
      yAxis:
        myFishingWeightMean > 1000
          ? myFishingWeight.map((w) => Number((w / 1000).toFixed(2)))
          : myFishingWeight.map((w) => Number(w.toFixed(2))),
      xAxis,
    },
  };

  const handleClick = (type: BenchmarkType) => {
    const modal = {
      ...modalParams[type],
    };

    dispatch(setBenchmarkModal(modal));
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 3, backgroundColor: "primary.main" }}
    >
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total tid"
            avatar={<AccessTimeIcon sx={{ color: "text.secondary" }} />}
            value={createDurationFromHours(myTotalTimes[0])}
            description="Siste tur"
            primary_color={
              myTotalTimes[0] > myTotalTimeMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(myTotalTimeMean)}
            secondary_description={
              "Gjennomsnitt siste " + myTotalTimes.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine DEP og POR meldinger"
            onClick={() => handleClick(BenchmarkType.TotalTime)}
            third_value={createDurationFromHours(followTotalTimeMean)}
            third_description="Gjennomsnitt fulgte fartøy"
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fisketid"
            avatar={<PhishingRoundedIcon sx={{ color: "text.secondary" }} />}
            value={createDurationFromHours(myFishingHours[0])}
            description="Siste tur"
            primary_color={
              myFishingHours[0] > myFishingHoursMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={createDurationFromHours(myFishingHoursMean)}
            secondary_description={
              "Gjennomsnitt siste " + myFishingHours.length.toString() + " turer"
            }
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingHours)}
            third_value={createDurationFromHours(followFishingHoursMean)}
            third_description="Gjennomsnitt fulgte fartøy"
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Fiskedistanse"
            avatar={<StraightenRoundedIcon sx={{ color: "text.secondary" }} />}
            value={(myFishingDistanceMean > 1852
              ? myFishingDistance[0] / 1852
              : myFishingDistance[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              myFishingDistance[0] > myFishingDistanceMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(myFishingDistanceMean > 1852
              ? myFishingDistanceMean / 1852
              : myFishingDistanceMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " +
              myFishingDistance.length.toString() +
              " turer"
            }
            metric={myFishingDistanceMean > 1852 ? "nautiske mil" : "meter"}
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingDistance)}
            third_value={(followFishingDistanceMean > 1852
              ? followFishingDistanceMean / 1852
              : followFishingDistanceMean
            ).toFixed(1)}
            third_description="Gjennomsnitt fulgte fartøy"
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <BenchmarkCard
            title="Total vekt"
            avatar={<ScaleRoundedIcon sx={{ color: "text.secondary" }} />}
            value={(myFishingWeightMean > 1000
              ? myFishingWeight[0] / 1000
              : myFishingWeight[0]
            ).toFixed(1)}
            description="Siste tur"
            primary_color={
              myFishingWeight[0] > myFishingWeightMean ? "#6CE16A" : "#93032E"
            }
            secondary_value={(myFishingWeightMean > 1000
              ? myFishingWeightMean / 1000
              : myFishingWeightMean
            ).toFixed(1)}
            secondary_description={
              "Gjennomsnitt siste " + myFishingWeight.length.toString() + " turer"
            }
            metric={myFishingWeightMean > 1000 ? "tonn" : "kilo"}
            tooltip="Data basert på levert vekt"
            onClick={() => handleClick(BenchmarkType.FishingWeight)}
            third_value={(followFishingWeightMean > 1000
              ? followFishingWeightMean / 1000
              : followFishingWeightMean
            ).toFixed(1)}
            third_description="Gjennomsnitt fulgte fartøy"
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};
