export enum Months {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  Juli,
  August,
  September,
  October,
  November,
  December,
}

export interface YearsMonths {
  years: number[];
  months: number[];
}

export interface LengthGroup {
  id: number;
  name: string;
  min: number;
  max: number;
}
export const LengthGroupCodes: Record<number, LengthGroup> = {
  1: { id: 1, name: "Under 11m", min: 0, max: 11 },
  2: { id: 2, name: "11-14.9m", min: 11, max: 15 },
  3: { id: 3, name: "15-20.9m", min: 15, max: 21 },
  4: { id: 4, name: "21-27.9m", min: 21, max: 28 },
  5: { id: 5, name: "Over 28m", min: 28, max: Infinity },
};

export interface FilterStats {
  id: number;
  value: number;
}
