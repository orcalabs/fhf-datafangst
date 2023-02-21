export interface Haul {
  id: number;
  vesselId: number;
  haulDistance?: number | undefined;
  durationMinutes: number;
  end: HaulLocation | undefined;
  start: HaulLocation | undefined;
  gear: string;
  catches: HaulCatch[];
  alternateStartTimestamp?: number | undefined;
  alternateStartLat?: number | undefined;
  alternateStartLon?: number | undefined;
}

export interface HaulLocation {
  oceanDepth: number;
  lat: number;
  lon: number;
  timestamp: number;
}

export interface HaulCatch {
  livingWeight: number;
  specieId: number;
  specieName: string;
}
