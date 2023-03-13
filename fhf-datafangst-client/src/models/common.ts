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

export const LengthGroupCodes: LengthGroup[] = [
  { name: "Under 11m", id: 1, min: 0, max: 11 },
  { name: "11-14.9m", id: 2, min: 11, max: 15 },
  { name: "15-20.9m", id: 3, min: 15, max: 21 },
  { name: "21-27.9m", id: 4, min: 21, max: 28 },
  { name: "Over 28m", id: 5, min: 28, max: Infinity },
];
