import { getAllYearsArray } from "components/Filters/YearsFilter";
import { setMonth, setYear } from "date-fns";
import { LengthGroup } from "models";

export const createTimestampsFromYearsMonths = (
  years: number[] | undefined,
  months: number[] | undefined,
  minYear: number,
) => {
  if (!years?.length && !months?.length) {
    return undefined;
  }

  if (!years?.length) {
    years = getAllYearsArray(minYear);
  }
  if (!months?.length) {
    months = Array.from({ length: 12 }, (_, i) => i + 1);
  }

  const timestamps: Date[] = [];
  for (const month of months) {
    const date = setMonth(new Date(), month - 1);
    for (const year of years) {
      timestamps.push(setYear(date, year));
    }
  }

  return timestamps;
};

export const createVesselLengthQueryString = (
  vesselLengthRanges?: LengthGroup[],
) => {
  if (!vesselLengthRanges) {
    return undefined;
  }

  let res = "";
  for (const l of vesselLengthRanges) {
    if (l.max === Infinity) {
      res += "[" + l.min.toString() + ",)";
    } else {
      res += "[" + l.min.toString() + "," + l.max.toString() + ")";
    }

    res += ";";
  }

  // Remove last semicolon
  if (res.length) {
    res = res.slice(0, -1);
  }

  return res;
};
