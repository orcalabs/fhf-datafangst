import { AisPositionDetails } from "generated/openapi";

export interface Position {
  lat: number;
  lon: number;
  timestamp: string;
  cog?: number | null;
  det?: AisPositionDetails | null;
  speed?: number | null;
}
