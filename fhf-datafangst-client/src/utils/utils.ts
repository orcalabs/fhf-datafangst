import {
  differenceInHours,
  format,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { nb } from "date-fns/locale";
import {
  AisVmsPosition,
  Gear,
  Haul,
  RegisterVesselOwner,
  Vessel,
} from "generated/openapi";
import { Catch, CatchWeightType } from "models";

export const Months: Record<number, string> = {
  1: "Januar",
  2: "Februar",
  3: "Mars",
  4: "April",
  5: "Mai",
  6: "Juni",
  7: "Juli",
  8: "August",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};

export const MinErsYear = 2010;
export const MinLandingYear = 1999;

const setCharAt = (str: string, index: number, chr: string) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

type IntoDate = Date | number | string;

export const dateFormat = (d: IntoDate | undefined | null, f: string) =>
  d ? format(new Date(d), f, { locale: nb }) : "";

// Special title case formatter, specifically designed to format Vessel
// and Delivery Point names
export const toTitleCase = (name: string | undefined | null) => {
  if (!name) return "";

  // Ignore re-naming delivery points that are "Unntak i [region]"
  // or "Kaisalg i [region]"
  if (name.includes("Unntak") || name.includes("Kaisalg")) {
    return name;
  }

  // Strip multiple whitespaces from string, set to lower case and split on whitespace.
  const sentence = name.replace(/\s+/g, " ").trim().toLowerCase().split(" ");
  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === "as") {
      sentence[i] = "AS";
    } else if (sentence[i] === "ms") {
      sentence[i] = "MS";
    } else if (sentence[i] === "as,") {
      sentence[i] = "AS,";
    } else if (sentence[i] === "i") {
      sentence[i] = "I";
    } else if (sentence[i] === "ii") {
      sentence[i] = "II";
    } else if (sentence[i] === "iii") {
      sentence[i] = "III";
    } else if (sentence[i] === "iv") {
      sentence[i] = "IV";
    } else if (sentence[i] === "vi") {
      sentence[i] = "VI";
    } else if (sentence[i] === "vii") {
      sentence[i] = "VII";
      // Format names containing dash to have capital letter after dash
    } else if (sentence[i].includes("-")) {
      const index = sentence[i].indexOf("-");
      sentence[i] = setCharAt(
        sentence[i],
        index + 1,
        sentence[i].charAt(index + 1).toUpperCase(),
      );
    } else if (sentence[i].includes(".")) {
      for (let idx = 0; idx < sentence[i].length; idx++) {
        if (sentence[i][idx] === ".") {
          sentence[i] = setCharAt(
            sentence[i],
            idx + 1,
            sentence[i].charAt(idx + 1).toUpperCase(),
          );
        }
      }
    }

    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  const res = sentence.join(" ");
  return res;
};

export const middle = (a: number, b: number, c: number) =>
  a + b + c - Math.max(a, b, c) - Math.min(a, b, c);

export const sumCatches = (
  catches: Catch[],
  weightType: CatchWeightType = "livingWeight",
) => {
  return catches.reduce((sum, curr) => sum + (curr[weightType] ?? 0), 0);
};

export const findHighestHaulCatchWeight = (hauls: Haul[]) => {
  let highest = 0;
  for (const haul of hauls) {
    const sum = sumCatches(haul.catches);
    if (sum > highest) {
      highest = sum;
    }
  }

  return highest;
};

export const distanceFormatter = (distance: number) =>
  distance >= 1000
    ? (distance / 1000).toFixed(1) + " km"
    : distance.toFixed(1) + " m";

export const createDurationString = (duration: Duration) => {
  const durationString = formatDuration(duration, {
    format: ["months", "days", "hours", "minutes"],
    delimiter: ", ",
    locale: nb,
  });

  if (!durationString[0]) {
    return "Ukjent";
  }

  return durationString[0].toUpperCase() + durationString.substring(1);
};
export const createDurationFromHours = (hours: number) =>
  createDurationString(
    intervalToDuration({
      start: new Date(0),
      end: new Date(hours * 3_600_000),
    }),
  );

export const createObjectDurationString = (obj: {
  start: IntoDate;
  end: IntoDate;
}) =>
  createDurationString(
    intervalToDuration({
      start: new Date(obj.start),
      end: new Date(obj.end),
    }),
  );

export const createHaulDurationString = (haul: Haul) =>
  createObjectDurationString({
    start: haul.startTimestamp,
    end: haul.stopTimestamp,
  });

export const kilosOrTonsFormatter = (weight: number) =>
  weight >= 1000
    ? (weight / 1000).toFixed(1) + " tonn"
    : weight.toFixed(1) + "  kg";

export const differenceHours = (date1: Date, date2: Date) => {
  if (date1 > date2) {
    return differenceInHours(date1, date2);
  } else {
    return differenceInHours(date2, date1);
  }
};

export const createGearListString = (gears: Gear[]) =>
  gears.map((g) => g.name).join(", ");

export const createOwnersListString = (owners: RegisterVesselOwner[]) =>
  owners.map((g) => toTitleCase(g.name)).join(", ");

export const reduceHaulsCatches = (
  hauls: Haul[] | undefined,
): Record<number, Catch> =>
  hauls?.reduce((tot: Record<number, Catch>, cur) => {
    for (const c of cur.catches) {
      if (c.speciesFiskeridirId) {
        const x = tot[c.speciesFiskeridirId];
        if (x) {
          x.livingWeight += c.livingWeight;
        } else {
          tot[c.speciesFiskeridirId] = {
            speciesFiskeridirId: c.speciesFiskeridirId,
            livingWeight: c.livingWeight,
          };
        }
      }
    }
    return tot;
  }, {}) ?? {};

export const reduceCatchesOnSpecies = (
  catches: Catch[],
): Record<number, Catch> =>
  catches?.reduce((tot: Record<number, Catch>, cur) => {
    if (cur.speciesFiskeridirId) {
      const x = tot[cur.speciesFiskeridirId];
      if (x) {
        x.livingWeight += cur.livingWeight;
        if (x.grossWeight !== undefined && cur.grossWeight !== undefined) {
          x.grossWeight += cur.grossWeight;
        }
        if (x.productWeight !== undefined && cur.productWeight !== undefined) {
          x.productWeight += cur.productWeight;
        }
      } else {
        tot[cur.speciesFiskeridirId] = {
          speciesFiskeridirId: cur.speciesFiskeridirId,
          livingWeight: cur.livingWeight,
          grossWeight: cur.grossWeight,
          productWeight: cur.productWeight,
        };
      }
    }
    return tot;
  }, {}) ?? {};

export const trackForHaul = (
  track: AisVmsPosition[] | undefined,
  haul: Haul | undefined,
) => {
  if (!track || !haul) {
    return;
  }
  const haulTrack: AisVmsPosition[] = [];

  for (let i = 0; i < track.length; i++) {
    const pos = track[i];

    if (
      new Date(pos.timestamp) >= new Date(haul.startTimestamp) &&
      new Date(pos.timestamp) <= new Date(haul.stopTimestamp)
    ) {
      haulTrack.push(pos);
    }
  }

  return haulTrack;
};

export const withoutKeys = (
  obj?: Record<any, any>,
  ...keys: any[]
): Record<any, any> | undefined => {
  const res = { ...obj };

  for (const key of keys) {
    // eslint-disable-next-line
    delete res[key];
  }

  return res;
};

export const getGearGroupsFromVessels = (vessels: Vessel[]) => {
  let res: number[] = [];
  for (const vessel of vessels) {
    res = res.concat(vessel.gearGroups);
  }

  return res;
};
