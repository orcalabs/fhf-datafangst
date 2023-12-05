import {
  GearDetailed,
  GearGroupDetailed,
  GearMainGroupDetailed,
} from "generated/openapi";

export interface GearState {
  gears?: GearDetailed[];
  gearGroups?: GearGroupDetailed[];
  gearMainGroups?: GearMainGroupDetailed[];
}

export const initialGearState: GearState = {
  gears: undefined,
  gearGroups: undefined,
  gearMainGroups: undefined,
};
