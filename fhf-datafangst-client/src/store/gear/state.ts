import { Gear, GearGroup, GearMainGroup } from "models";

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
