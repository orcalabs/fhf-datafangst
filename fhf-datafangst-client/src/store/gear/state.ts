import { Gear, GearGroup, GearMainGroup } from "generated/openapi";

export interface GearState {
  gears?: Gear[];
  gearGroups?: GearGroup[];
  gearMainGroups?: GearMainGroup[];
}

export const initialGearState: GearState = {
  gears: undefined,
  gearGroups: undefined,
  gearMainGroups: undefined,
};
