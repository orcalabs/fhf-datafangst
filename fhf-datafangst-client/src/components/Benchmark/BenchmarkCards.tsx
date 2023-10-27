import { FC } from "react";
import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import {
  selectBwUserProfile,
  selectTrips,
  selectVesselsByCallsign,
  selectVesselsByFiskeridirId,
  useAppDispatch,
  useAppSelector,
} from "store";
import { Grid } from "@mui/material";
import {
  BenchmarkModalParams,
  selectBenchmarkTrips,
  setBenchmarkModal,
} from "store/benchmark";
import { Trip } from "generated/openapi";
import { BenchmarkModal } from "./BenchmarkModal";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhishingRoundedIcon from "@mui/icons-material/PhishingRounded";
import { createDurationFromHours } from "utils";

const getTotalTimes = (trip: Trip) =>
  (new Date(trip.end).getTime() - new Date(trip.start).getTime()) / 3_600_000;

const getFishingHours = (trip: Trip) =>
  trip.hauls.reduce(
    (tot, h) =>
      tot +
      (new Date(h.stopTimestamp).getTime() -
        new Date(h.startTimestamp).getTime()) /
        3_600_000,
    0,
  );

const getFishingDistance = (trip: Trip) =>
  trip.hauls.reduce((tot, h) => tot + (h.haulDistance ?? 0), 0);

const getFishingWeight = (trip: Trip) => trip.delivery.totalLivingWeight;

enum BenchmarkType {
  TotalTime,
  FishingHours,
  FishingDistance,
  FishingWeight,
}

const createDataset = (
  ownTrips: Trip[],
  followTrips: Record<number, Trip[]>,
  dataExtractor: (t: Trip) => number,
  reducer: (d: number) => number,
) => {
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  const vesselNames = [vessel?.fiskeridir.name ?? ""];
  const dataset = [
    ["date", "vesselName", "value"],
    ...ownTrips.map((trip) => [
      trip.start,
      vessel?.fiskeridir.name ?? "",
      reducer(dataExtractor(trip)),
    ]),
    ...Object.keys(followTrips).reduce(
      (acc: [string, string, number][], fiskeridirId: string) => {
        const name = fiskeridirVessels[+fiskeridirId].fiskeridir.name ?? "";
        vesselNames.push(name);
        const tmp: [string, string, number][] = followTrips[+fiskeridirId].map(
          (trip) => [trip.start, name, reducer(dataExtractor(trip))],
        );
        return [...acc, ...tmp];
      },
      [],
    ),
  ];
  return { dataset, vesselNames };
};

export const BenchmarkCards: FC = () => {
  const dispatch = useAppDispatch();
  const followTrips = useAppSelector(selectBenchmarkTrips);

  const followTripsList = Object.values(followTrips).reduce(
    (acc: Trip[], pre: Trip[]) => [...pre, ...acc],
    [],
  );
  const hasFollows = followTripsList.length !== 0;
  console.log(hasFollows);
  const trips = useAppSelector(selectTrips);
  if (!trips) {
    return <></>;
  }

  const myTotalTimes = trips.map((trip) => getTotalTimes(trip));
  const myFishingHours = trips.map((trip) => getFishingHours(trip));
  const myFishingDistance = trips.map((trip) => getFishingDistance(trip));
  const myFishingWeight = trips.map((trip) => getFishingWeight(trip));
  const myTotalTimeMean =
    myTotalTimes.reduce((a, b) => a + b, 0) / myTotalTimes.length;
  const myFishingHoursMean =
    myFishingHours.reduce((a, b) => a + b, 0) / myFishingHours.length;
  const myFishingDistanceMean =
    myFishingDistance.reduce((a, b) => a + b, 0) / myFishingDistance.length;
  const myFishingWeightMean =
    myFishingWeight.reduce((a, b) => a + b, 0) / myFishingWeight.length;

  const followTotalTimes = followTripsList.map((trip) => getTotalTimes(trip));
  const followFishingHours = followTripsList.map((trip) =>
    getFishingHours(trip),
  );
  const followFishingDistance = followTripsList.map((trip) =>
    getFishingDistance(trip),
  );
  const followFishingWeight = followTripsList.map((trip) =>
    getFishingWeight(trip),
  );
  const followTotalTimeMean =
    followTotalTimes.reduce((a, b) => a + b, 0) / followTotalTimes.length;
  const followFishingHoursMean =
    followFishingHours.reduce((a, b) => a + b, 0) / followFishingHours.length;
  const followFishingDistanceMean =
    followFishingDistance.reduce((a, b) => a + b, 0) /
    followFishingDistance.length;
  const followFishingWeightMean =
    followFishingWeight.reduce((a, b) => a + b, 0) / followFishingWeight.length;

  const modalParams: Record<BenchmarkType, BenchmarkModalParams> = {
    [BenchmarkType.TotalTime]: {
      title: "Total tid",
      description:
        "Total tid er regnet som tiden mellom havneavgang og havneanløp.",
      dataset: {
        ...createDataset(
          trips,
          followTrips,
          getTotalTimes,
          myTotalTimeMean > 24 ? (d) => d / 24 : (d) => d,
        ),
        metric: myTotalTimeMean > 24 ? "Dager" : "Timer",
      },
    },
    [BenchmarkType.FishingHours]: {
      title: "Fisketid",
      description:
        "Fisketid er regnet som summen av tiden brukt under hver fangstmelding.",
      dataset: {
        ...createDataset(
          trips,
          followTrips,
          getFishingHours,
          myFishingHoursMean > 24 ? (d) => d / 24 : (d) => d,
        ),
        metric: myFishingHoursMean > 24 ? "Dager" : "Timer",
      },
    },

    [BenchmarkType.FishingDistance]: {
      title: "Fiskedistanse",
      description:
        "Fiskedistanse er regnet ut basert på VMS og AIS-meldingene som ble sendt under hver fangstmelding.",
      dataset: {
        ...createDataset(
          trips,
          followTrips,
          getFishingDistance,
          myFishingDistanceMean > 1852 ? (d) => d / 1852 : (d) => d,
        ),
        metric: myFishingDistanceMean > 1852 ? "Nautiske mil" : "Meter",
      },
    },
    [BenchmarkType.FishingWeight]: {
      title: "Total vekt",
      description: "Total vekt er basert på total landet vekt",
      dataset: {
        ...createDataset(
          trips,
          followTrips,
          getFishingWeight,
          myFishingWeightMean > 1000 ? (d) => d / 1000 : (d) => d,
        ),
        metric: myFishingWeightMean > 1000 ? "Tonn" : "Kilo",
      },
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
            third_value={
              hasFollows
                ? createDurationFromHours(followTotalTimeMean)
                : undefined
            }
            third_description={
              hasFollows ? "Gjennomsnitt fulgte fartøy" : undefined
            }
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
              "Gjennomsnitt siste " +
              myFishingHours.length.toString() +
              " turer"
            }
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingHours)}
            third_value={
              hasFollows
                ? createDurationFromHours(followFishingHoursMean)
                : undefined
            }
            third_description={
              hasFollows ? "Gjennomsnitt fulgte fartøy" : undefined
            }
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
              myFishingDistance[0] > myFishingDistanceMean
                ? "#6CE16A"
                : "#93032E"
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
            third_value={
              hasFollows
                ? (followFishingDistanceMean > 1852
                    ? followFishingDistanceMean / 1852
                    : followFishingDistanceMean
                  ).toFixed(1)
                : undefined
            }
            third_description={
              hasFollows ? "Gjennomsnitt fulgte fartøy" : undefined
            }
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
              "Gjennomsnitt siste " +
              myFishingWeight.length.toString() +
              " turer"
            }
            metric={myFishingWeightMean > 1000 ? "tonn" : "kilo"}
            tooltip="Data basert på levert vekt"
            onClick={() => handleClick(BenchmarkType.FishingWeight)}
            third_value={
              hasFollows
                ? (followFishingWeightMean > 1000
                    ? followFishingWeightMean / 1000
                    : followFishingWeightMean
                  ).toFixed(1)
                : undefined
            }
            third_description={
              hasFollows ? "Gjennomsnitt fulgte fartøy" : undefined
            }
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};
