import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { haulBuilder, selectBwUserProfile, selectSpeciesFiskeridir, selectTrips, selectVesselsByCallsign, useAppSelector } from "store";
import { Graph } from "./Graph";
import { Haul, Trip } from "generated/openapi";
import { objectTraps } from "immer/dist/internal";

const getSpeciesfromHaul = (haul: Haul) => haul.catches.map((h) => h.speciesFiskeridirId);
const getWeightFromHaul = (haul: Haul) => haul.catches.map((h) => h.livingWeight);

const HaulToDict = (haul: Haul) => haul.catches.reduce((acc, curr) => ({
    ...acc,
    [curr.speciesFiskeridirId]: curr.livingWeight,
}), {});

const sumObjectValues = (obj: Haul[]) => {
    const data: Record<number, number> = {};
 obj.map((haul) => {
     const haulData = HaulToDict(haul);
    Object.keys(haulData).forEach((key) => {
        console.log(haulData);
        data[key] = (data[key] || 0) + haulData[key];
    });
    return data;
});
return data;
};

export const SpeciesHistogram: FC = () => {
    const options = {};
    const theme = {};
    const trips = useAppSelector(selectTrips);
    const species = useAppSelector(selectSpeciesFiskeridir);
    console.log(species);

    console.log(trips);
    if (!trips) {
        return <>No trips found</>;
    }

    const lastTrip: Trip = trips[0];
    const hauls = lastTrip.hauls;
    let data: Record<number, number> = {};

    data = sumObjectValues(hauls);
    const current = HistogramOptions(data, species, "current");
    const prev_data = sumObjectValues(trips[1].hauls);

    const prev = HistogramOptions(prev_data, species, "previous");
    const opt = {
            ...current,
            xAxis: {
                ...current.xAxis,
                data: current.xAxis.data.concat(prev.xAxis.data),
            },
            yAxis: [current.yAxis, prev.yAxis],
            series: [...current.series, ...prev.series],

        };

    return <Box sx ={{
        justifyContent: "end",
        alignItems: "center",
    }}>
        {data && <Graph options={opt} theme={theme} />}
    </Box>;
};

const HistogramOptions = (data: Record<number, number>, species: object[], name: string) => ({
      tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
    xAxis: {
        type: "category",
        data: Object.keys(data).map((key) => species.find((s) => s.id === parseInt(key))?.name),
    },
    yAxis: {
        type: "value",
        name,

    },
grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
    series: [
        {
            name,
            data: Object.values(data),
            type: "bar",
        },
    ],

});
