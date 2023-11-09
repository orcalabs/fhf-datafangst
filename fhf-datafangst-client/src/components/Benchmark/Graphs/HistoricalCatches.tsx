import { Box, Divider, Typography } from "@mui/material";
import { FC } from "react";
import {
  BenchmarkTimeSpanParams,
  selectBenchmarkTimeSpan,
  selectLandings,
  selectSpeciesFiskeridir,
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
    const monthIdx: number = new Date(landing.landingTimestamp).getMonth() + 1;

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
  const speciesList = useAppSelector(selectSpeciesFiskeridir);
  const { filtered, species } = filterLandingOnTimespan(
    Object.values(landings),
    landingTimespan,
  );
  console.log(filtered);

  const option = SpeciesStatOption(
    filtered,
    landingTimespan,
    species,
    speciesList,
  );
  console.log(option);

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
          option={SpeciesStatOption(
            filtered,
            landingTimespan,
            species,
            speciesList,
          )}
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
  speciesNames: SpeciesFiskeridir[],
) => ({
  legend: {},
  tooltip: {
    trigger: "axis",
    formatter,

    axisPointer: {
      type: "shadow",
    },
  },
  dataset: [
    {
      dimensions: ["Years", "Months", "Species", "Weight"],
      source: createSource(filtered, landingTimespan),
      print: true,
    },
    // {
    //   transform : {
    //     type: "filter",
    //     config: {dimension: "Years", value : landingTimespan.startYear,}
    //   }
    // },
    // {
    //   transform : {
    //     type: "filter",
    //     config: {dimension: "Years", value : landingTimespan.endYear,}
    //   }
    // },
    ...transformDataSource(filtered, landingTimespan),
  ],
  xAxis: {
    type: "category",
    name: "Months",
    axisLabel: {
      formatter: (value: number) => Months[value],
    },
  },

  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (value: number) => kilosOrTonsFormatter(value),
    },
  },
  series: [
    //   {
    //   type: "bar",
    //   name : "2023-tot",
    //   encode: {
    //     x: "Months",
    //     y: "Weight",
    //   },
    //   datasetIndex: 1,
    // },
    // {
    //   type: "bar",
    //   name : "2022-tot",
    //   encode: {
    //     x: "Months",
    //     y: "Weight",
    //   },
    //     emphasis: {
    //         focus: "series",
    //       },
    //   datasetIndex: 2,
    // },
    ...createSeries(filtered, speciesNames),
  ],
});

interface TooltipParams {
  value: number[];
}
const formatter = (data: TooltipParams[]) => {
  console.log(data);
  // const tooltipContent = (
  //   <Box>
  //     <Typography
  //       style={{
  //         margin: 0,
  //         marginBottom: 8,
  //         color: `${theme.palette.secondary.dark}`,
  //       }}
  //       variant="h3"
  //     >
  //       {species}
  //     </Typography>
  //     <Typography style={{ margin: 0 }}>
  //       <b>Forrige tur:</b> {kilosOrTonsFormatter(prev ?? 0)}
  //     </Typography>
  //     <Typography style={{ margin: 0 }}>
  //       <b>Snitt:</b> {kilosOrTonsFormatter(mean ?? 0)}
  //     </Typography>
  //   </Box>
  // );

  // return renderToStaticMarkup(tooltipContent);
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
const createSeries = (
  filtered: BenchmarkTimeSpanObject,
  speciesNames: SpeciesFiskeridir[],
) => {
  const series: object[] = [];
  let idx = 1;

  // for (const year in filtered) {
    for (const month in filtered[2022]) {
      for (const species in filtered[2022][month]) {
        series.push({
          name: speciesNames.find((s) => s.id === +species)?.name ?? "Ukjent",
          type: "bar",
          stack: 2022,
          emphasis: {
            focus: "series",
          },
          encode: {
            x: "Months",
            y: "Weight",
          },
          datasetIndex: idx,
        });
        idx += 1;
      }
    }
    console.log(idx)
    for (const month in filtered[2023]) {
      for (const species in filtered[2023][month]) {
        series.push({
          name: speciesNames.find((s) => s.id === +species)?.name ?? "Ukjent",
          type: "bar",
          stack: 2023,
          emphasis: {
            focus: "series",
          },
          encode: {
            x: "Months",
            y: "Weight",
          },
          datasetIndex: idx,
        });
        idx += 1;
      }
    }
    console.log(idx)
  // }

  // unrollFiltered(
  //   filtered,
  //   series,
  //   (
  //     data: UnrollType,
  //     year: number,
  //     month: number,
  //     species: number,
  //     weight: number,
  //     index: number | undefined,
  //   ) => {
  //     data.push({
  //       name: speciesNames.find((s) => s.id === species)?.name ?? "Ukjent",
  //       type: "bar",
  //       stack: year,
  //       emphasis: {
  //         focus: "series",
  //       },
  //       encode: {
  //         x: "Months",
  //         y: "Weight",
  //       },
  //       datasetIndex: index + 3,

  //     });
  //   },
  // );

  return series;
};

const createSource = (
  filtered: BenchmarkTimeSpanObject,
  landingTimespan: BenchmarkTimeSpanParams,
) => {
  const source: (string | number)[][] = [
    ["Years", "Months", "Species", "Weight"],
  ];
  const dsIndex: Record<number, Record<number, number>> = {
    [landingTimespan.startYear]: {},
    [landingTimespan.endYear]: {},
  };

  unrollFiltered(
    filtered,
    source,
    (data, year, month, species, weight, index) => {
      data.push([+year, +month, +species, weight]);
    },
  );

  console.log(dsIndex);
  return source;
};
const transformDataSource = (
  src: BenchmarkTimeSpanObject,
  year: BenchmarkTimeSpanParams,
) => {
  const createTransformObjectsBySpecies = (
    src: BenchmarkTimeSpanObject,
    year: number,
  ) => {
    const curr = src[year];
    const uniqueSpecies: string[] = [];
    Object.keys(Months).forEach((element) => {
      uniqueSpecies.push(Object.keys(curr[+element] ?? []));
    });
    const flatUniqueSpecies = uniqueSpecies
      .flat(Infinity)
      .filter((value, index, array) => array.indexOf(value) === index);

    return flatUniqueSpecies.map((s) => ({
      transform: {
        type: "filter",
        config: {
          and: [
            { dimension: "Years", "=": year },
            { dimension: "Species", "=": s },
          ],
        },
        print: true,
      },
    }));
  };

  const x = [
    ...createTransformObjectsBySpecies(src, year.endYear),
    ...createTransformObjectsBySpecies(src, year.startYear),
  ];
  console.log(x);
  return x;
};
