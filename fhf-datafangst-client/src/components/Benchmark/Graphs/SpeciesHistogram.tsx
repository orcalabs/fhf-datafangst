import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC } from "react";
import {
  selectSpeciesFiskeridir,
  selectTrips,
  useAppDispatch,
  useAppSelector,
} from "store";
import { Delivery, Haul, SpeciesFiskeridir, Trip } from "generated/openapi";
import {
  BenchmarkDataSource,
  selectBenchmarkDataSource,
  selectBenchmarkNumHistoric,
  selectBenchmarkTrips,
  setBenchmarkDataSource,
} from "store/benchmark";
import ReactEChart from "echarts-for-react";
import { kilosOrTonsFormatter } from "utils";
import chartsTheme from "app/chartsTheme";
import { renderToStaticMarkup } from "react-dom/server";
import theme from "app/theme";

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
    <>
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
            color: "white",
            px: 2,
            fontSize: "1rem",
            width: "50%",
            border: `1px solid ${theme.palette.primary.dark}`,
            "&.Mui-selected": {
              backgroundColor: "primary.dark",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            },
            "&:hover": { bgcolor: "secondary.dark" },
          },
        }}
      >
        <Typography variant="h3" color="text.secondary">
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
    </>
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
        `Siste ${numHistoric} turer`,
        "Snitt",
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
}
const formatter = (data: TooltipParams[]) => {
  const [species, prev, mean] = data[0].value;
  const tooltipContent = (
    <Box>
      <Typography
        style={{
          margin: 0,
          marginBottom: 8,
          color: `${theme.palette.secondary.dark}`,
        }}
        variant="h3"
      >
        {species}
      </Typography>
      <Typography style={{ margin: 0 }}>
        <b>Forrige tur:</b> {kilosOrTonsFormatter(prev ?? 0)}
      </Typography>
      <Typography style={{ margin: 0 }}>
        <b>Snitt:</b> {kilosOrTonsFormatter(mean ?? 0)}
      </Typography>
    </Box>
  );

  return renderToStaticMarkup(tooltipContent);
};
