import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import "echarts/i18n/langnb-NO.js";
import { useMemo, type FC } from "react";
import type { PerTripStats } from "~/generated/openapi";
import { TripKpi, type TripKpiKey } from "~/models";

const kpiConfig = {
  [TripKpi.LivingWeight]: {
    label: "Fangst (rundvekt)",
    unit: "kg",
  },
  [TripKpi.WeightPerHour]: {
    label: "Fangst per dag",
    unit: "kg/dag",
  },
  [TripKpi.WeightPerDistance]: {
    label: "Fangst per distanse",
    unit: "kg/nm",
  },
  [TripKpi.FuelConsumptionLiter]: {
    label: "Drivstofforbruk",
    unit: "liter",
  },
  [TripKpi.WeightPerFuelLiter]: {
    label: "Fangst per liter drivstoff",
    unit: "kg/l",
  },
  [TripKpi.CatchValuePerFuelLiter]: {
    label: "Fangstverdi per liter drivstoff",
    unit: "kr/l",
  },
  [TripKpi.NumHauls]: {
    label: "Antall hal",
    unit: "hal",
  },
  [TripKpi.ValueNok]: {
    label: "Fangstverdi",
    unit: "kr",
  },
  [TripKpi.TripDurationSeconds]: {
    label: "Turvarighet",
    unit: "dager",
  },
} satisfies Record<TripKpiKey, { label: string; unit: string }>;

interface Props {
  open: boolean;
  onClose: () => void;
  selectedKpi: TripKpiKey;
  trips: PerTripStats[];
}

const numberFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const TripChartModal: FC<Props> = ({
  open,
  onClose,
  selectedKpi,
  trips,
}) => {
  const { label, unit } = kpiConfig[selectedKpi];

  const option = useMemo<EChartsOption>(() => {
    const sortedTrips = [...trips].sort(
      (a, b) =>
        new Date(a.endTimestamp).getTime() - new Date(b.endTimestamp).getTime(),
    );

    const data = sortedTrips.map((trip) => {
      const rawValue = trip[selectedKpi];

      const value =
        rawValue == null
          ? null
          : selectedKpi === TripKpi.TripDurationSeconds
            ? rawValue / 86400
            : selectedKpi === TripKpi.WeightPerHour
              ? rawValue * 24
              : rawValue;

      return {
        value: [new Date(trip.endTimestamp).getTime(), value],
        tripId: trip.tripId,
        startTimestamp: trip.startTimestamp,
        endTimestamp: trip.endTimestamp,
      };
    });

    return {
      grid: {
        left: 25,
        right: 30,
        top: 35,
        bottom: 65,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
        formatter: (params: any) => {
          const point = params[0];
          if (!point) return "";

          const { startTimestamp, endTimestamp } = point.data;
          const value = point.value[1];

          return [
            `<strong>TUR</strong>`,
            `${dateFormatter.format(new Date(startTimestamp))} – ${dateFormatter.format(new Date(endTimestamp))}`,
            `<strong>${label}:</strong> ${
              value == null
                ? "Ingen data"
                : `${numberFormatter.format(value)} ${unit}`
            }`,
          ].join("<br/>");
        },
      },
      xAxis: {
        type: "time",
        name: "Dato",
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: {
          formatter: {
            year: "{yyyy}",
            month: "{MMM} {yyyy}",
            day: "{d}. {MMM}",
            hour: "{HH}:{mm}",
          },
          hideOverlap: true,
        },
      },
      yAxis: {
        type: "value",
        name: unit,
        scale: true,
        axisLabel: {
          formatter: (value: number) => numberFormatter.format(value),
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            opacity: 0.35,
          },
        },
      },
      series: [
        {
          name: label,
          type: "line",
          data,
          smooth: false,
          connectNulls: false,
          showSymbol: true,
          symbol: "circle",
          symbolSize: 9,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: "#324F7C",
          },
          areaStyle: {
            opacity: 0.08,
          },
          emphasis: {
            scale: 1.5,
          },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          bottom: 10,
          height: 20,
        },
      ],
    };
  }, [trips, selectedKpi, label, unit]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 32px)",
          maxWidth: 1600,
          maxHeight: "90dvh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {label} per tur
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <ReactECharts
          opts={{ locale: "nb-NO" }}
          option={option}
          notMerge
          style={{ height: 500, width: "100%" }}
        />
      </Box>
    </Modal>
  );
};
