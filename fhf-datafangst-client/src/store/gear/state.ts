import { Gear, GearGroup, GearMainGroup } from "generated/openapi";

export interface GearState {
  gear: Gear[];
  gearGroups: GearGroup[];
  gearMainGroups: GearMainGroup[];
}

export const initialGearState: GearState = {
  gear: [],
  gearGroups: [],
  gearMainGroups: [],
};
