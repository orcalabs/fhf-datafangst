export interface CurrentPosition {
  lat: number;
  lon: number;
  cog?: number | undefined;
  timestamp: number;
  speed?: number | undefined;
  mmsi: number;
  navigationStatus?: string | undefined;
}
