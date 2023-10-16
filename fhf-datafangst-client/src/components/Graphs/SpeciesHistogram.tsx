import { Box, Button, ButtonGroup, Divider, Typography } from "@mui/material";
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
  setBenchmarkDataSource,
} from "store/benchmark";
import { Theme } from "./ChartsTheme";
import ReactEChart from "echarts-for-react";
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

  if (!trips) {
    return <>No trips found</>;
  }

  const generateHaulData = (trips?: Trip[]) => {
    if (!trips) {
      return { data: {}, prevData: {} };
    }

    const data = sumObjectValues(trips[0].hauls);

    const prevTrips = trips.slice(1, numHistoric);
    const prevData = sumObjectValues(prevTrips.flatMap((t) => t.hauls));
    for (const [key, value] of Object.entries(prevData)) {
      prevData[+key] = value / prevTrips.length;
    }

    return { data, prevData };
  };

  const generateLandingData = (trips?: Trip[]) => {
    if (!trips) {
      return { data: {}, prevData: {} };
    }

    const data = sumObjectValues([trips[0].delivery]);

    const prevTrips = trips.slice(1, numHistoric);
    const prevData = sumObjectValues(prevTrips.map((t) => t.delivery));
    for (const [key, value] of Object.entries(prevData)) {
      prevData[+key] = value / prevTrips.length;
    }

    return { data, prevData };
  };

  const { data, prevData } =
    selectedDatasource === BenchmarkDataSource.Hauls
      ? generateHaulData(trips)
      : generateLandingData(trips);

  return (
    <>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="h3" color="text.secondary">
          {selectedDatasource ? "Fangstdata" : "Landingsdata"}
        </Typography>
      </Divider>
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{ margin: 2, alignSelf: "center" }}
        >
          <Button
            onClick={() =>
              dispatch(setBenchmarkDataSource(BenchmarkDataSource.Hauls))
            }
          >
            Fangstdata
          </Button>
          <Button
            onClick={() =>
              dispatch(setBenchmarkDataSource(BenchmarkDataSource.Landings))
            }
          >
            Landingsdata
          </Button>
        </ButtonGroup>
        {data && (
          <ReactEChart
            option={datasetOption(data, prevData, species)}
            theme={Theme}
          />
        )}
      </Box>
    </>
  );
};

const datasetOption = (
  a: Record<number, number>,
  b: Record<number, number>,
  species: SpeciesFiskeridir[],
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
      ["Art", "Forrige tur", "Snitt"],
      ...getDictSortedOnValue(a).map((key) => [
        species.find((s: SpeciesFiskeridir) => s.id === parseInt(key))?.name,
        a[+key],
        b[+key],
      ]),
    ],
  },

  xAxis: { type: "category" },
  yAxis: { gridIndex: 0, name: "Kilo" },
  series: [{ type: "bar" }, { type: "bar" }],
});

interface TooltipParams {
  value: number[];
}
const formatter = (data: TooltipParams[]) => {
  const [species, prev, mean] = data[0].value;

  return `<h3>${species}</h3>
<b> Forrige tur </b>: ${kilosOrTonsFormatter(prev ?? 0)}
<br/>
<b>Snitt </b>: ${kilosOrTonsFormatter(mean ?? 0)}`;
};
