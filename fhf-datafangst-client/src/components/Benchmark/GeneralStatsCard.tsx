import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import type { Trip } from "~/generated/openapi";
import {
  selectAvgVesselBenchmarkLoading,
  selectTripsLoading,
  useAppSelector,
} from "~/store";
import { hoursToDays, kilosOrTonsFormatter, nok } from "~/utils";

interface Props {
  trips?: Trip[];
}

export const GeneralStatsCard: FC<Props> = ({ trips }) => {
  const isLoading = useAppSelector(selectAvgVesselBenchmarkLoading);
  const tripsLoading = useAppSelector(selectTripsLoading);

  const sumWeight = trips?.reduce(
    (sum, trip) => sum + trip.delivery.totalLivingWeight,
    0,
  );

  const sumHauls = trips?.reduce((sum, trip) => sum + trip.hauls.length, 0);
  const totalTime = trips?.map(
    (trip) =>
      (new Date(trip.end).getTime() - new Date(trip.start).getTime()) /
      3_600_000,
  )?.[0];

  const sumPrice = trips?.reduce(
    (sum, trip) => sum + trip.delivery.totalPriceForFisher,
    0,
  );

  return (
    <>
      <Card
        variant="elevation"
        sx={{
          m: "auto",
          borderRadius: 2,
          width: "100%",
          color: "#5868ae",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
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
              <StatBox title="Antall turer" value={trips?.length} />

              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Total rundvekt (levert)"
                value={sumWeight ? kilosOrTonsFormatter(sumWeight) : undefined}
              />
              <Divider orientation="vertical" flexItem />
              <StatBox title="Antall hal" value={sumHauls} />
              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Dager brukt"
                value={totalTime ? hoursToDays(totalTime) : undefined}
              />
              <Divider orientation="vertical" flexItem />
              <StatBox
                title="Verdi"
                value={sumPrice ? nok.format(sumPrice) : undefined}
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
  suffix?: string;
  value?: number | string | null | undefined;
}

const StatBox: FC<StatProps> = ({ title, suffix, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={1}>
        <Typography sx={{ color: "#757d81", textAlign: "center" }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          {value ?? "Ukjent"} {suffix ?? ""}
        </Typography>
      </Stack>
    </Box>
  );
};
