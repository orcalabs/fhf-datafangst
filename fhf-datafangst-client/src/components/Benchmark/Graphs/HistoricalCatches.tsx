import { Box, Divider, Grid, Typography } from "@mui/material";
import { FC } from "react";
import {
  BenchmarkTimeSpanParams,
  selectBenchmarkTimeSpan,
  selectLandings,
  selectSpeciesFiskeridir,
  useAppSelector,
} from "store";
import { Landing, SpeciesFiskeridir } from "generated/openapi";
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

  // populate data with empty months

  Object.keys(Months).forEach((month) => {
    data[years.startYear][+month] = {};
    data[years.endYear][+month] = {};
  });

  const species: number[] = [];
  const totalWeight: Record<number, number> = {};

  for (const landing of landings) {
    const year = new Date(landing.landingTimestamp).getFullYear();
    const monthIdx: number = new Date(landing.landingTimestamp).getMonth() + 1;

    data[year] = data[year] ?? {};
    data[year][monthIdx] = data[year][monthIdx] ?? {};

    for (const c of landing.catches) {
      data[year][monthIdx][c.speciesFiskeridirId] =
        (data[year][monthIdx][c.speciesFiskeridirId] ?? 0) + c.livingWeight;

      species.push(c.speciesFiskeridirId);
      totalWeight[c.speciesFiskeridirId] =
        (totalWeight[c.speciesFiskeridirId] ?? 0) + c.livingWeight;
    }
  }

  // add missing species
  for (const year in data) {
    for (const month in data[year]) {
      for (const s of species) {
        data[year][month][s] = data[year][month][s] ?? 0;
      }
    }
  }
  return { filtered: data, species: totalWeight };
};

export const HistoricalCatches: FC = () => {
  const landings = useAppSelector(selectLandings);
  const landingTimespan = useAppSelector(selectBenchmarkTimeSpan);
  const speciesList = useAppSelector(selectSpeciesFiskeridir);
  const { filtered, species } = filterLandingOnTimespan(
    Object.values(landings),
    landingTimespan,
  );

  return (
    <Box>
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
          Hittil i år
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
    </Box>
  );
};

const toSpeciesName = (species: SpeciesFiskeridir[], id: number) =>
  species.find((s) => s.id === id)?.name ?? "Ukjent";

const SpeciesStatOption = (
  filtered: BenchmarkTimeSpanObject,
  landingTimespan: BenchmarkTimeSpanParams,
  speciesRecord: Record<number, number>,
  speciesNames: SpeciesFiskeridir[],
) => ({
  legend: {
    type: "scroll",
    bottom: 10,
    width: "50%",
    pageTextStyle: {
      color: "white",
    },
    data: [
      ...[
        landingTimespan.endYear.toString(),
        landingTimespan.startYear.toString(),
      ],
      ...Object.keys(speciesRecord)
        .sort((a, b) => speciesRecord[+b] - speciesRecord[+a])
        .map((s) => toSpeciesName(speciesNames, +s)),
    ],

    selected: {
      ...{ [landingTimespan.startYear]: true, [landingTimespan.endYear]: true },
      ...Object.keys(speciesRecord).reduce(
        (acc, curr) => ({
          ...acc,
          [toSpeciesName(speciesNames, +curr)]: speciesRecord[+curr] > 10000,
        }),
        {},
      ),
    },
  },

  toolbox: {},
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter: (params: any) => {
      const topSpecies = 5;
      const paramSorted = params
        .sort((a: any, b: any) => a.value.slice(-1)[0] - b.value.slice(-1)[0])
        .filter((p: any) => p.value.slice(-1)[0] > 0);

      const linePlots = paramSorted
        .filter((p: any) => p.seriesType === "line")
        .sort((a: any, b: any) => b.value.slice(-1)[0] - a.value.slice(-1)[0]);

      const currYearbarPlot = paramSorted
        .filter(
          (p: any) =>
            p.seriesType === "bar" && p.value[0] === landingTimespan.startYear,
        )
        .sort((a: any, b: any) => b.value.slice(-1)[0] - a.value.slice(-1)[0])
        .slice(0, topSpecies);

      const lastYearbarPlot = paramSorted
        .filter(
          (p: any) =>
            p.seriesType === "bar" && p.value[0] === landingTimespan.endYear,
        )
        .sort((a: any, b: any) => b.value.slice(-1)[0] - a.value.slice(-1)[0])
        .slice(0, topSpecies);

      const month = Months[paramSorted[0].value[paramSorted[0].encode.x[0]]];
      return renderToStaticMarkup(
        <Box>
          <Typography variant="h4" color="text.secondary">
            Totalvekt
          </Typography>
          {linePlots.map((p: any) => (
            <Box key={p.seriesName}>
              <Typography variant="body1" color="text.secondary">
                {p.seriesName}: {kilosOrTonsFormatter(p.value.slice(-1)[0])}
              </Typography>
            </Box>
          ))}
          <Divider
            sx={{
              my: 1,
              borderColor: "text.secondary",
            }}
          />
          <Grid container>
            <Grid item xs={6}>
              <Typography
                sx={{
                  textAlign: "right",
                }}
                variant="h4"
              >
                Topp 5 i {month} {landingTimespan.endYear}{" "}
              </Typography>
              {lastYearbarPlot.map((p: any) => (
                <Box key={p.seriesName}>
                  <Typography variant="body1" color="text.secondary">
                    {p.seriesName}: {kilosOrTonsFormatter(p.value.slice(-1)[0])}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  textAlign: "right",
                }}
                variant="h4"
              >
                Topp 5 i {month} {landingTimespan.startYear}{" "}
              </Typography>
              {currYearbarPlot.map((p: any) => (
                <Box key={p.seriesName}>
                  <Typography variant="body1" color="text.secondary">
                    {p.seriesName}: {kilosOrTonsFormatter(p.value.slice(-1)[0])}
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>,
      );
    },
  },

  dataset: [
    ...createSource(filtered),
    {
      fromDatasetId: "cumSum",
      transform: {
        type: "filter",
        config: {
          dimension: "Years",
          "=": landingTimespan.startYear,
        },
      },
    },
    {
      fromDatasetId: "cumSum",
      transform: {
        type: "filter",
        config: {
          dimension: "Years",
          "=": landingTimespan.endYear,
        },
      },
    },

    ...transformDataSource(filtered, landingTimespan),
  ],
  xAxis: {
    type: "category",
    axisLabel: {
      formatter: (value: number) => Months[value],
    },
  },

  yAxis: [
    {
      type: "value",
      name: "Vekt (art)",
      axisLabel: {
        formatter: (value: number) => kilosOrTonsFormatter(value),
      },
    },
    {
      type: "value",
      name: "Akkumulert vekt (månedlig)",

      axisLabel: {
        formatter: (value: number) => kilosOrTonsFormatter(value),
      },
    },
  ],
  series: [
    {
      type: "line",
      name: landingTimespan.startYear,
      datasetIndex: 2,
      yAxisIndex: 1,
      axisLabel: {
        formatter: (value: number) => kilosOrTonsFormatter(value),
      },
      encode: {
        tooltip: [2],
        x: "Months",
        y: "Sum",
      },
    },
    {
      type: "line",
      datasetIndex: 3,
      yAxisIndex: 1,
      name: landingTimespan.endYear,
      axisLabel: {
        formatter: (value: number) => kilosOrTonsFormatter(value),
      },
      encode: {
        tooltip: [2],
        x: "Months",
        y: "Sum",
      },
    },
    ...createSeries(filtered, landingTimespan, speciesNames),
  ],
});

const createSeries = (
  filtered: BenchmarkTimeSpanObject,
  landingTimespan: BenchmarkTimeSpanParams,
  speciesNames: SpeciesFiskeridir[],
) => {
  const series: object[] = [];
  let idx = 4; // hardcode

  const flat = createSource(filtered)[0].source;

  const pushSeries = (year: number) => {
    const yearList = flat.filter((x) => x[0] === year);
    const speciesYear = new Set<string | number>(yearList.map((x) => x[2]));
    for (const species of Array.from(speciesYear.values())) {
      series.push({
        name: toSpeciesName(speciesNames, +species),
        type: "bar",
        stack: year,
        datasetId: `${species}-${year}`,
        emphasis: {
          focus: "series",
        },

        encode: {
          x: "Months",
          y: "Weight",
          tooltip: [0, 1, 2, 3],
        },
        datasetIndex: idx,
      });
      idx += 1;
    }
  };

  pushSeries(landingTimespan.endYear);
  pushSeries(landingTimespan.startYear);

  return series;
};

const createSource = (filtered: BenchmarkTimeSpanObject) => {
  const source: (string | number)[][] = [
    ["Years", "Months", "Species", "Weight"],
  ];
  const cumSumSource: (string | number)[][] = [["Years", "Months", "Sum"]];

  for (const year in filtered) {
    let sum = 0;
    for (const month in filtered[year]) {
      for (const species in filtered[year][month]) {
        source.push([+year, +month, +species, filtered[year][month][species]]);
        sum += filtered[+year][+month][species];
      }
      cumSumSource.push([+year, +month, sum]);
    }
  }

  return [
    { id: "raw", source },
    { id: "cumSum", source: cumSumSource },
  ];
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
    const uniqueSpecies: (string[] | string)[] = [];
    Object.keys(Months).forEach((element) => {
      uniqueSpecies.push(Object.keys(curr[+element] ?? []));
    });
    const flatUniqueSpecies = uniqueSpecies
      .flat(Infinity)
      .filter((value, index, array) => array.indexOf(value) === index);

    return flatUniqueSpecies.map((s) => ({
      fromDatasetId: "raw",
      transform: {
        type: "filter",
        config: {
          and: [
            { dimension: "Years", "=": year },
            { dimension: "Species", "=": s },
          ],
        },
      },
    }));
  };

  const x = [
    ...createTransformObjectsBySpecies(src, year.endYear),
    ...createTransformObjectsBySpecies(src, year.startYear),
  ];
  return x;
};
