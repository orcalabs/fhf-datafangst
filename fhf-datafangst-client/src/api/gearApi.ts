import { Gear, GearGroup, GearMainGroup } from "models";
import { apiGet } from ".";

export const getGear = async () => apiGet<Gear[]>("gear");

export const getGearGroups = async () => apiGet<GearGroup[]>("gear_groups");

export const getGearMainGroups = async () =>
  apiGet<GearMainGroup[]>("gear_main_groups");
