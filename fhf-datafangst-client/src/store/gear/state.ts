import { Gear, GearGroup, GearMainGroup } from "generated/openapi";

export interface GearState {
  gears: Record<number, Gear>;
  gearGroups: GearGroup[];
  gearMainGroups: GearMainGroup[];
}

export const initialGearState: GearState = {
  gears: {},
  gearGroups: [],
  gearMainGroups: [],
};
