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

export interface LengthGroup {
  id: number;
  name: string;
  min: number;
  max: number;
}

export const LengthGroups: LengthGroup[] = [
  { id: 0, name: "Ukjent", min: -1, max: -1 },
  { id: 1, name: "Under 11m", min: 0, max: 11 },
  { id: 2, name: "11-14.9m", min: 11, max: 15 },
  { id: 3, name: "15-20.9m", min: 15, max: 21 },
  { id: 4, name: "21-27.9m", min: 21, max: 28 },
  { id: 5, name: "Over 28m", min: 28, max: Infinity },
];

export const LengthGroupsMap: Record<number, LengthGroup> = Object.fromEntries(
  LengthGroups.map((l) => [l.id, l]),
);

export const EventType: Record<number, string> = {
  1: "LND",
  2: "DCA",
  3: "POR",
  4: "DEP",
  5: "TRA",
  6: "HAL",
};
