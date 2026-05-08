import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhishingRoundedIcon from "@mui/icons-material/PhishingRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useMemo, type FC } from "react";
import type { Trip } from "~/generated/openapi";
import {
  selectBenchmarkTrips,
  selectLoggedInVessel,
  selectTrips,
  selectVesselsByFiskeridirId,
  setBenchmarkModal,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import {
  createDurationFromHours,
  kilosOrTonsFormatter,
  metersToNatuticalMilesString,
  unreachable,
} from "~/utils";
import { BenchmarkCard } from "./BenchmarkCard";
import { BenchmarkModal } from "./BenchmarkModal";

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

export const BenchmarkCards: FC = () => {
  const dispatch = useAppDispatch();

  const trips = useAppSelector(selectTrips);
  const followTrips = useAppSelector(selectBenchmarkTrips);
  const vessel = useAppSelector(selectLoggedInVessel);
  const fiskeridirVessels = useAppSelector(selectVesselsByFiskeridirId);

  const data = useMemo(() => {
    if (!trips) {
      return undefined;
    }

    const followTripsList = Object.values(followTrips).flat();
    const hasFollows = followTripsList.length !== 0;

    const myTotalTimes = trips.map((trip) => getTotalTimes(trip));
    const myFishingHours = trips.map((trip) => getFishingHours(trip));
    const myFishingDistance = trips.map((trip) => getFishingDistance(trip));
    const myFishingWeight = trips.map(
      (trip) => trip.delivery.totalLivingWeight,
    );
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
    const followFishingWeight = followTripsList.map(
      (trip) => trip.delivery.totalLivingWeight,
    );
    const followTotalTimeMean =
      followTotalTimes.reduce((a, b) => a + b, 0) / followTotalTimes.length;
    const followFishingHoursMean =
      followFishingHours.reduce((a, b) => a + b, 0) / followFishingHours.length;
    const followFishingDistanceMean =
      followFishingDistance.reduce((a, b) => a + b, 0) /
      followFishingDistance.length;
    const followFishingWeightMean =
      followFishingWeight.reduce((a, b) => a + b, 0) /
      followFishingWeight.length;

    return {
      hasFollows,
      myTotalTimes,
      myFishingHours,
      myFishingDistance,
      myFishingWeight,
      myTotalTimeMean,
      myFishingHoursMean,
      myFishingDistanceMean,
      myFishingWeightMean,
      followTotalTimeMean,
      followFishingHoursMean,
      followFishingDistanceMean,
      followFishingWeightMean,
    };
  }, [followTrips, trips]);

  if (!trips || !data) {
    return <></>;
  }

  const {
    hasFollows,
    myTotalTimes,
    myFishingHours,
    myFishingDistance,
    myFishingWeight,
    myTotalTimeMean,
    myFishingHoursMean,
    myFishingDistanceMean,
    myFishingWeightMean,
    followTotalTimeMean,
    followFishingHoursMean,
    followFishingDistanceMean,
    followFishingWeightMean,
  } = data;

  const handleClick = (type: BenchmarkType) => {
    const createDataset = (
      dataExtractor: (t: Trip) => number,
      reducer: (d: number) => number,
      metric: string,
    ) => {
      const vesselNames = [vessel?.fiskeridir.name ?? ""];
      const dataset = [
        ["date", "vesselName", "value"],
        ...trips.map((trip) => [
          trip.start,
          vessel?.fiskeridir.name ?? "",
          reducer(dataExtractor(trip)),
        ]),
        ...Object.keys(followTrips).reduce(
          (acc: [string, string, number][], fiskeridirId: string) => {
            const name = fiskeridirVessels[+fiskeridirId].fiskeridir.name ?? "";
            vesselNames.push(name);
            const tmp: [string, string, number][] = followTrips[
              +fiskeridirId
            ].map((trip) => [trip.start, name, reducer(dataExtractor(trip))]);
            return [...acc, ...tmp];
          },
          [],
        ),
      ];
      return { dataset, vesselNames, metric };
    };

    let modal;
    switch (type) {
      case BenchmarkType.TotalTime:
        modal = {
          title: "Total tid",
          description:
            "Total tid er regnet som tiden mellom havneavgang og havneanløp.",
          dataset: createDataset(
            getTotalTimes,
            myTotalTimeMean > 24 ? (d) => d / 24 : (d) => d,
            myTotalTimeMean > 24 ? "Dager" : "Timer",
          ),
        };
        break;
      case BenchmarkType.FishingHours:
        modal = {
          title: "Fisketid",
          description:
            "Fisketid er regnet som summen av tiden brukt under hver fangstmelding.",
          dataset: createDataset(
            getFishingHours,
            myFishingHoursMean > 24 ? (d) => d / 24 : (d) => d,
            myFishingHoursMean > 24 ? "Dager" : "Timer",
          ),
        };
        break;
      case BenchmarkType.FishingDistance:
        modal = {
          title: "Fiskedistanse",
          description:
            "Fiskedistanse er regnet ut basert på VMS og AIS-meldingene som ble sendt under hver fangstmelding.",
          dataset: createDataset(
            getFishingDistance,
            myFishingDistanceMean > 1852 ? (d) => d / 1852 : (d) => d,
            myFishingDistanceMean > 1852 ? "Nautiske mil" : "Meter",
          ),
        };
        break;
      case BenchmarkType.FishingWeight:
        modal = {
          title: "Total vekt",
          description: "Total vekt er basert på total landet vekt",
          dataset: createDataset(
            getFishingWeight,
            myFishingWeightMean > 1000 ? (d) => d / 1000 : (d) => d,
            myFishingWeightMean > 1000 ? "Tonn" : "Kilo",
          ),
        };
        break;
      default:
        unreachable(type);
    }

    dispatch(setBenchmarkModal(modal));
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid size={6}>
        <Box>
          <BenchmarkCard
            title="Total tid"
            avatar={
              <AccessTimeIcon sx={{ color: "fifth.main" }} fontSize="large" />
            }
            value={createDurationFromHours(myTotalTimes[0])}
            description="Siste tur"
            secondaryStat={[
              "Gjennomsnitt siste " + myTotalTimes.length.toString() + " turer",
              createDurationFromHours(myTotalTimeMean),
            ]}
            thirdStat={
              hasFollows
                ? [
                    "Gjennomsnitt fulgte fartøy",
                    createDurationFromHours(followTotalTimeMean),
                  ]
                : undefined
            }
            tooltip="Regnet ut basert på dine DEP og POR meldinger"
            onClick={() => handleClick(BenchmarkType.TotalTime)}
          />
        </Box>
      </Grid>
      <Grid size={6}>
        <Box>
          <BenchmarkCard
            title="Fisketid"
            avatar={
              <PhishingRoundedIcon
                sx={{ color: "fifth.main" }}
                fontSize="large"
              />
            }
            value={createDurationFromHours(myFishingHours[0])}
            description="Siste tur"
            secondaryStat={[
              "Gjennomsnitt siste " +
                myFishingHours.length.toString() +
                " turer",
              createDurationFromHours(myFishingHoursMean),
            ]}
            thirdStat={
              hasFollows
                ? [
                    "Gjennomsnitt fulgte fartøy",
                    createDurationFromHours(followFishingHoursMean),
                  ]
                : undefined
            }
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingHours)}
          />
        </Box>
      </Grid>
      <Grid size={6}>
        <Box>
          <BenchmarkCard
            title="Fiskedistanse"
            avatar={
              <StraightenRoundedIcon
                sx={{ color: "fifth.main" }}
                fontSize="large"
              />
            }
            value={metersToNatuticalMilesString(myFishingDistance[0])}
            description="Siste tur"
            secondaryStat={[
              "Gjennomsnitt siste " +
                myFishingDistance.length.toString() +
                " turer",
              metersToNatuticalMilesString(myFishingDistanceMean),
            ]}
            thirdStat={
              hasFollows
                ? [
                    "Gjennomsnitt fulgte fartøy",
                    metersToNatuticalMilesString(followFishingDistanceMean),
                  ]
                : undefined
            }
            tooltip="Regnet ut basert på dine fangstmeldinger"
            onClick={() => handleClick(BenchmarkType.FishingDistance)}
          />
        </Box>
      </Grid>
      <Grid size={6}>
        <Box>
          <BenchmarkCard
            title="Total vekt"
            avatar={
              <ScaleRoundedIcon sx={{ color: "fifth.main" }} fontSize="large" />
            }
            value={kilosOrTonsFormatter(myFishingWeight[0])}
            description="Siste tur"
            secondaryStat={[
              "Gjennomsnitt siste " +
                myFishingWeight.length.toString() +
                " turer",
              kilosOrTonsFormatter(myFishingWeightMean),
            ]}
            thirdStat={
              hasFollows
                ? [
                    "Gjennomsnitt fulgte fartøy",
                    kilosOrTonsFormatter(followFishingWeightMean),
                  ]
                : undefined
            }
            tooltip="Data basert på levert vekt"
            onClick={() => handleClick(BenchmarkType.FishingWeight)}
          />
        </Box>
      </Grid>
      <BenchmarkModal />
    </Grid>
  );
};
