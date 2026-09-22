import { Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { selectAvgVesselBenchmarkLoading, useAppSelector } from "~/store";

interface Props {
  title: string;
  value?: number | string | null;
}

export const GeneralStatsCard: FC<Props> = ({ value, title }) => {
  const isLoading = useAppSelector(selectAvgVesselBenchmarkLoading);

  return (
    <Card
      variant="elevation"
      sx={{
        m: "auto",
        bgcolor: "#b1d5e0",
        borderRadius: 2,
        width: 280,
        height: 160,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={180}
            height={60}
            sx={{ my: "10px" }}
          />
        ) : (
          <Stack spacing={1}>
            <Typography sx={{ color: "#757d81", textAlign: "center" }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              {value ?? "Ukjent"}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
