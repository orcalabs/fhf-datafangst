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
}

export const LengthGroups: LengthGroup[] = [
  { id: VesselLengthGroup.Unknown, name: "Ukjent" },
  { id: VesselLengthGroup.UnderEleven, name: "Under 11m" },
  { id: VesselLengthGroup.ElevenToFifteen, name: "11-14.9m" },
  { id: VesselLengthGroup.FifteenToTwentyOne, name: "15-20.9m" },
  { id: VesselLengthGroup.TwentyTwoToTwentyEight, name: "21-27.9m" },
  { id: VesselLengthGroup.TwentyEightAndAbove, name: "Over 28m" },
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
