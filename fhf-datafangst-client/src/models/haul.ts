import { GearGroup, SpeciesGroup, Vessel, LengthGroup } from "models";
import { Box } from "utils";

export interface Haul {
  vesselCallSignErs: string;
  ersActivityId: string;
  quotaTypeId: number;
  startTimestamp: string;
  startLongitude: number;
  startLatitude: number;
  stopLatitude: number;
  stopLongitude: number;
  stopTimestamp: string;
  duration: number;
  oceanDepthEnd: number;
  oceanDepthStart: number;
  vesselLength: number;
  fiskeridirVesselId?: number;
  gearGroupId?: number;
  haulDistance?: number;
  catchLocationStart?: string;
  catchLocationEnd?: string;
  vesselCallSign?: string;
  vesselName?: string;
  vesselNameErs?: string;
  catches: HaulCatch[];
  whaleCatches: WhaleCatch[];
}

export interface HaulCatch {
  livingWeight: number;
  mainSpeciesFiskeridirId?: number;
  speciesFiskeridirId?: number;
  speciesGroupId?: number;
}

export interface WhaleCatch {
  grenadeNumber: string;
  blubberMeasureA?: number;
  blubberMeasureB?: number;
  blubberMeasureC?: number;
  circumference?: number;
  fetusLength?: number;
  genderId?: string;
  individualNumber?: number;
  length?: number;
}

export interface HaulsFilter {
  vessel?: Vessel;
  region?: Box;
  speciesGroups?: SpeciesGroup[];
  gearGroups?: GearGroup[];
  weight?: [number, number];
  lengthGroups?: LengthGroup[];
}
