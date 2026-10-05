import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  GaugeContainer,
  GaugeReferenceArc,
  GaugeValueArc,
} from "@mui/x-charts/Gauge";
import type { FC } from "react";
import theme from "~/app/theme";
import { selectAvgVesselBenchmarkLoading, useAppSelector } from "~/store";

interface Props {
  title: string;
  value?: number | null;
  max?: number | null;
  suffix?: string;
  color?: string;
  inverse?: boolean;
  valueText?: string;
  precision?: number;
}

const colors = [
  "#D73027", // 0–10
  "#E34A33", // 10–20
  "#F46D43", // 20–30
  "#F9844A", // 30–40
  "#F9C74F", // 40–50
  "#F9D85E", // 50–60
  "#C9DF8A", // 60–70
  "#90C987", // 70–80
  "#5FB477", // 80–90
  "#16803C", // 90–100
];

export const BenchmarkPieChart: FC<Props> = ({
  value,
  max,
  suffix,
  title,
  inverse,
  valueText,
  precision,
}) => {
  const isLoading = useAppSelector(selectAvgVesselBenchmarkLoading);

  const getColorForPercent = (percent: number) => {
    const index = Math.min(Math.floor(percent / 10), colors.length - 1);

    return colors[index];
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  return (
    <Card
      variant="elevation"
      sx={{ m: "auto", bgcolor: "white", borderRadius: 2 }}
    >
      <CardHeader
        title={title}
        slotProps={{
          title: {
            sx: {
              fontSize: "1.2rem",
            },
          },
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={180}
            height={180}
            sx={{ my: "10px" }}
          />
        ) : (
          <>
            {value && max ? (
              <GaugeContainer
                width={250}
                height={200}
                value={clamp(
                  inverse ? 100 - (value / max) * 100 : (value / max) * 100,
                  0,
                  100,
                )}
                valueMax={100}
                startAngle={-100}
                endAngle={100}
                innerRadius="70%"
                outerRadius="100%"
              >
                <GaugeReferenceArc />

                <GaugeValueArc
                  style={{
                    fill: getColorForPercent(
                      clamp(
                        inverse
                          ? 100 - (value / max) * 100
                          : (value / max) * 100,
                        0,
                        100,
                      ),
                    ),
                  }}
                />

                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x="50%"
                    dy="26"
                    fill={theme.palette.secondary.dark}
                    fontSize="28"
                    fontWeight="bold"
                  >
                    {valueText ?? value.toFixed(precision ?? 1)}
                  </tspan>

                  <tspan
                    x="50%"
                    dy="24"
                    fill={theme.palette.grey.A100}
                    fontSize="16"
                  >
                    {suffix}
                  </tspan>
                </text>
              </GaugeContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  width: 200,
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.grey.A100,
                    fontSize: "1.15rem",
                  }}
                >
                  Ingen data
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
