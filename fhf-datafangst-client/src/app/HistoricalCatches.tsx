import { Box, Divider, Typography } from "@mui/material";
import { FC } from "react";
import {
  BenchmarkTimeSpanParams,
  selectBenchmarkTimeSpan,
  selectLandings,
  useAppSelector,
} from "store";
import {
  Delivery,
  Haul,
  Landing,
  LandingCatch,
  SpeciesFiskeridir,
  Trip,
} from "generated/openapi";
import ReactEChart from "echarts-for-react";
import { Months, kilosOrTonsFormatter } from "utils";
import chartsTheme from "app/chartsTheme";
import { renderToStaticMarkup } from "react-dom/server";
import theme from "app/theme";
import { log } from "console";
type BenchmarkTimeSpanObject = Record<
  number,
  Record<number, Record<number, number>>
>;
const filterLandingOnTimespan = (
  landings: Landing[],
  years: BenchmarkTimeSpanParams,
) => {
  const data: BenchmarkTimeSpanObject = {
    [years.startYear]: {},
    [years.endYear]: {},
  };
  const species: number[] = [];

  for (const landing of landings) {
    const year = new Date(landing.landingTimestamp).getFullYear();
    const monthIdx: number = new Date(landing.landingTimestamp).getMonth();

    data[year] = data[year] ?? {};
    data[year][monthIdx] = data[year][monthIdx] ?? {};

    for (const c of landing.catches) {
      data[year][monthIdx][c.speciesFiskeridirId] =
        (data[year][monthIdx][c.speciesFiskeridirId] ?? 0) + c.livingWeight;

      species.push(c.speciesFiskeridirId);
    }
  }

  return { filtered: data, species: Array.from(new Set(species)) };
};

export const HistoricalCatches: FC = () => {
  const landings = useAppSelector(selectLandings);
  const landingTimespan = useAppSelector(selectBenchmarkTimeSpan);

  const { filtered, species } = filterLandingOnTimespan(
    Object.values(landings),
    landingTimespan,
  );
  console.log(filtered);

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
          Noe
        </Typography>
      </Box>

      {filtered && (
        <ReactEChart
          option={SpeciesStatOption(filtered, landingTimespan, species)}
          theme={chartsTheme}
        />
      )}
    </>
  );
};

const SpeciesStatOption = (
  filtered: BenchmarkTimeSpanObject,
  landingTimespan: BenchmarkTimeSpanParams,
  speciesList: number[],
) => ({
  legend: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  dataset: [
    {
      dimensions: ["Years", "Months", "Species", "Weight"],
      source: createSource(filtered, landingTimespan),
    },
    ...Object.keys(filtered).map((x) => {
      return Object.values(filtered[+x]).map((y) => {
        return Object.values(y).map((z) => ({
          transform: {
            type: "filter",
            and: [
              { dimension: "Years", "=": x },
              { dimension: "Species", "=": z },
            ],
            print: true,
          },
        }));
      });
    }),
  ],
  xAxis: {
    type: "category",
    name: "Months",
    axisLabel: {
      formatter: (value: number) => Months[value + 1],
    },
  },

  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (value: number) => kilosOrTonsFormatter(value),
    },
  },

  series: createSeries(filtered),
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

type UnrollType = (string | number | object)[];

const unrollFiltered = (
  filtered: BenchmarkTimeSpanObject,
  data: UnrollType,
  func: (
    data: UnrollType,
    year: number,
    month: number,
    species: number,
    weight: number,
    index: number | undefined,
  ) => any,
) => {
  let i = 1;

  for (const year in filtered) {
    for (const month in filtered[year]) {
      for (const species in filtered[year][month]) {
        i += 1;
        func(data, +year, +month, +species, filtered[year][month][species], i);
      }
    }
  }
};
const createSeries = (filtered: BenchmarkTimeSpanObject) => {
  const series: object[] = [];
  unrollFiltered(
    filtered,
    series,
    (
      data: UnrollType,
      year: number,
      month: number,
      species: number,
      weight: number,
      index: number | undefined,
    ) => {
      data.push({
        type: "bar",
        stack: `${year}-${month}`,
        encode: {
          x: "Months",
          y: "Weight",
        },
        datasetIndex: index,
        
      });
    },
  );

  console.log(series);
  return series
};

const createSource = (
  filtered: BenchmarkTimeSpanObject,
  _landingTimespan: BenchmarkTimeSpanParams,
) => {
  const source: (string | number)[][] = [
    ["Years", "Months", "Species", "Weight"],
  ];

  unrollFiltered(filtered, source, (data, year, month, species, weight) => {
    data.push([+year, +month, +species, weight]);
  });
  //   for (const year in filtered) {
  //     for (const month in filtered[year]) {
  //       for (const species in filtered[year][month]) {
  //         source.push([
  //           +year,
  //           +month,
  //           +species,
  //           filtered[+year][+month][+species],
  //         ]);
  //       }
  //     }
  //   }

  return source;
};
