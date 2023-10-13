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
import { Graph } from "./Graph";
import { Delivery, Haul, SpeciesFiskeridir, Trip } from "generated/openapi";
import {
  selectBenchmarkDataSource,
  selectBenchmarkNumHistoric,
  setBenchmarkDataSource,
} from "store/benchmark";

const toggleLandingHaul = (a: Haul | Delivery) =>
  "catches" in a ? a.catches : a.delivered;

const HaulToDict = (haul: Haul | Delivery) =>
  toggleLandingHaul(haul).reduce(
    (acc, curr) => ({
      ...acc,
      [curr.speciesFiskeridirId]: curr.livingWeight,
    }),
    {},
  );

const sumObjectValues = (obj: Haul[]) => {
  const data: Record<number, number> = {};
  obj.map((haul) => {
    const haulData: Record<number, number> = HaulToDict(haul);
    Object.keys(haulData).forEach((key: any) => {
      data[key] = (data[key] || 0) + haulData[key];
    });
    return data;
  });

  return data;
};

const getDictSortedOnValue = (obj: Record<number, number>) =>
  Object.keys(obj).sort((a: string, b: string) => obj[+b] - obj[+a]);

export const SpeciesHistogram: FC = () => {
  const theme = {};
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
    const lastTrip: Trip = trips[0];
    const hauls = lastTrip.hauls;
    let data: Record<number, number> = {};

    data = sumObjectValues(hauls);
    // sort by weight
    const prevData: Record<number, number> = {};
    trips.slice(1, numHistoric).forEach((trip: any) => {
      const tripData: Record<number, number> = sumObjectValues(trip.hauls);

      Object.keys(tripData).forEach((key: any) => {
        prevData[key] = (prevData[key] || 0) + tripData[key];
      });
    });

    Object.keys(prevData).forEach((key: any) => {
      prevData[key] = prevData[key] / trips.length;
    });
    return { data, prevData };
  };

  const generateLandingData = (trips?: Trip[]) => {
    if (!trips) {
      return { data: {}, prevData: {} };
    }

    const lastTrip: Trip = trips[0];
    const landing = lastTrip.delivery;
    let data: Record<number, number> = {};
    data = HaulToDict(landing);

    const prevData: Record<number, number> = trips
      .slice(1, numHistoric)
      .map((trip) => {
        const landing = trip.delivery;
        return HaulToDict(landing);
      })
      .reduce((acc: Record<number, number>, curr: Record<number, number>) => {
        Object.keys(curr).forEach((key: any) => {
          acc[key] = (acc[key] || 0) + curr[key];
        });
        return acc;
      }, {});

    Object.keys(prevData).forEach((key: any) => {
      prevData[key] = prevData[key] / trips.length;
    });

    return { data, prevData };
  };

  const { data, prevData } = selectedDatasource
    ? generateHaulData(trips)
    : generateLandingData(trips);

  return (
    <>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="h3">
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
          <Button onClick={() => dispatch(setBenchmarkDataSource(true))}>
            Fangstdata{" "}
          </Button>
          <Button onClick={() => dispatch(setBenchmarkDataSource(false))}>
            Landingsdata{" "}
          </Button>
        </ButtonGroup>
        {data && (
          <Graph
            options={datasetOption(data, prevData, species)}
            theme={theme}
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
  yAxis: { gridIndex: 0 },
  series: [{ type: "bar" }, { type: "bar" }],
});

interface TooltipParams {
  value: number[];
}
const formatter = (data: TooltipParams[]) => {
  const params = data[0];

  return `<h3>${params.value[0]}</h3> <br/> <b> Forrige tur </b>: ${params.value[1]} kg <br/> <b>Snitt </b>: ${params.value[2]} kg`;
};
