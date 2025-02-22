import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import chartsTheme from "app/chartsTheme";
import theme from "app/theme";
import ReactEChart from "echarts-for-react";
import { Delivery, Haul, SpeciesFiskeridir, Trip } from "generated/openapi";
import { FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BenchmarkDataSource,
  selectBenchmarkDataSource,
  selectBenchmarkNumHistoric,
  selectBenchmarkTrips,
  selectSpeciesFiskeridir,
  selectTrips,
  setBenchmarkDataSource,
  useAppDispatch,
  useAppSelector,
} from "store";
import { kilosOrTonsFormatter } from "utils";

const sumObjectValues = (hauls: (Haul | Delivery)[]) => {
  const res: Record<number, number> = {};
  for (const h of hauls) {
    for (const c of (h as Haul).catches ?? (h as Delivery).delivered) {
      res[c.speciesFiskeridirId] =
        (res[c.speciesFiskeridirId] ?? 0) + c.livingWeight;
    }
  }
  return res;
};

const getDictSortedOnValue = (obj: Record<number, number>) =>
  Object.keys(obj).sort((a: string, b: string) => obj[+b] - obj[+a]);

export const SpeciesHistogram: FC = () => {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const species = useAppSelector(selectSpeciesFiskeridir);
  const numHistoric = useAppSelector(selectBenchmarkNumHistoric);
  const selectedDatasource = useAppSelector(selectBenchmarkDataSource);
  const followTrips = useAppSelector(selectBenchmarkTrips);
  const followTripsList = Object.values(followTrips).flat();

  const generateHaulData = (trips?: Trip[], followTrips?: Trip[]) => {
    if (!trips || !followTrips) {
      return { data: {}, prevData: {}, followData: {} };
    }

    const data = sumObjectValues(trips[0].hauls);

    const prevTrips = trips.slice(1, numHistoric);
    const prevData = sumObjectValues(prevTrips.flatMap((t) => t.hauls));
    for (const [key, value] of Object.entries(prevData)) {
      prevData[+key] = value / prevTrips.length;
    }
    const followData = sumObjectValues(followTrips.flatMap((t) => t.hauls));
    for (const [key, value] of Object.entries(followData)) {
      followData[+key] = value / followTrips.length;
    }
    return { data, prevData, followData };
  };

  const generateLandingData = (trips?: Trip[], followTrips?: Trip[]) => {
    if (!trips || !followTrips) {
      return { data: {}, prevData: {}, followData: {} };
    }

    const data = sumObjectValues([trips[0].delivery]);

    const prevTrips = trips.slice(1, numHistoric);
    const prevData = sumObjectValues(prevTrips.map((t) => t.delivery));
    for (const [key, value] of Object.entries(prevData)) {
      prevData[+key] = value / prevTrips.length;
    }

    const followData = sumObjectValues(followTrips?.map((t) => t.delivery));
    for (const [key, value] of Object.entries(followData)) {
      followData[+key] = value / followTrips.length;
    }
    return { data, prevData, followData };
  };

  const { data, prevData, followData } =
    selectedDatasource === BenchmarkDataSource.Hauls
      ? generateHaulData(trips, followTripsList)
      : generateLandingData(trips, followTripsList);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 3,
        "& canvas": { borderRadius: 2 },
      }}
    >
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "& .MuiToggleButtonGroup-root": {
            width: 400,
          },
          "& .MuiToggleButtonGroup-grouped": {
            borderRadius: 0,
            width: 400,
            textTransform: "none",
          },
          "& .MuiToggleButton-root": {
            color: "black",
            px: 2,
            fontSize: "1rem",
            width: "50%",
            border: `1px solid ${theme.palette.primary.dark}`,
            "&.Mui-selected": {
              backgroundColor: "primary.light",
              color: "white",
              "&:hover": { bgcolor: "primary.light" },
            },
            "&:hover": { bgcolor: "primary.main", color: "white" },
          },
        }}
      >
        <Typography variant="h3" color="black">
          Fangst
        </Typography>
        <ToggleButtonGroup
          sx={{ margin: 3 }}
          size="small"
          exclusive
          value={selectedDatasource}
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newSource: BenchmarkDataSource,
          ) => {
            dispatch(setBenchmarkDataSource(newSource));
          }}
        >
          <ToggleButton value={BenchmarkDataSource.Landings}>
            Landingsdata
          </ToggleButton>
          <ToggleButton value={BenchmarkDataSource.Hauls}>
            Fangstdata (DCA)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {data && (
        <ReactEChart
          option={datasetOption(
            data,
            prevData,
            followData,
            species,
            numHistoric,
          )}
          theme={chartsTheme}
        />
      )}
    </Box>
  );
};

const datasetOption = (
  a: Record<number, number>,
  b: Record<number, number>,
  c: Record<number, number>,
  species: SpeciesFiskeridir[],
  numHistoric: number,
) => ({
  legend: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter,
  },
  dataset: {
    source: [
      [
        "Art",
        "Siste tur",
        `Siste ${numHistoric} turer`,
        `Siste ${numHistoric} fulgtes turer`,
      ],
      ...getDictSortedOnValue(a).map((key) => [
        species.find((s: SpeciesFiskeridir) => s.id === parseInt(key))?.name,
        a[+key],
        b[+key],
        c[+key],
      ]),
    ],
  },

  xAxis: { type: "category" },
  yAxis: { gridIndex: 0, name: "Kilo" },
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
});

interface TooltipParams {
  value: number[];
  color: string;
  seriesName: string;
  seriesIndex: number;
}
const formatter = (data: TooltipParams[]) => {
  const values = data[0].value;
  const tooltipContent = (
    <Box>
      <Typography
        sx={{
          m: 0,
          mb: 8,
          color: `${theme.palette.secondary.dark}`,
        }}
        variant="h3"
      >
        {values[0]}
      </Typography>
      {data.map((d, i) => (
        <Typography sx={{ m: 0 }} key={i}>
          <span
            style={{
              display: "inline-block",
              marginRight: 10,
              borderRadius: 10,
              width: 10,
              height: 10,
              backgroundColor: d.color,
            }}
          />
          <b>{d.seriesName}</b>{" "}
          {values[d.seriesIndex + 1]
            ? kilosOrTonsFormatter(values[d.seriesIndex + 1])
            : "-"}
        </Typography>
      ))}
    </Box>
  );

  return renderToStaticMarkup(tooltipContent);
};
