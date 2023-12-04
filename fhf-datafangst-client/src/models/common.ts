import { VesselEventType, VesselLengthGroup } from "generated/openapi";

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
  id: VesselLengthGroup;
  name: string;
  min: number;
  max: number;
}

export const LengthGroups: LengthGroup[] = [
  { id: VesselLengthGroup.Unknown, name: "Ukjent", min: -1, max: -1 },
  { id: VesselLengthGroup.UnderEleven, name: "Under 11m", min: 0, max: 11 },
  {
    id: VesselLengthGroup.ElevenToFifteen,
    name: "11-14.9m",
    min: 11,
    max: 15,
  },
  {
    id: VesselLengthGroup.FifteenToTwentyOne,
    name: "15-20.9m",
    min: 15,
    max: 21,
  },
  {
    id: VesselLengthGroup.TwentyTwoToTwentyEight,
    name: "21-27.9m",
    min: 21,
    max: 28,
  },
  {
    id: VesselLengthGroup.TwentyEightAndAbove,
    name: "Over 28m",
    min: 28,
    max: Infinity,
  },
];

export const LengthGroupsMap: Record<VesselLengthGroup, LengthGroup> =
  Object.fromEntries(LengthGroups.map((l) => [l.id, l])) as Record<
    VesselLengthGroup,
    LengthGroup
  >;

export const EventType: Record<VesselEventType, string> = {
  [VesselEventType.Landing]: "LND",
  [VesselEventType.ErsDca]: "DCA",
  [VesselEventType.ErsPor]: "POR",
  [VesselEventType.ErsDep]: "DEP",
  [VesselEventType.ErsTra]: "TRA",
  [VesselEventType.Haul]: "HAL",
};

export type CatchWeightType = "livingWeight" | "grossWeight" | "productWeight";
