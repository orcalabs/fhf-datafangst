import { CurrentPosition } from "models";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";

export interface Vessel {
  id: number;
  mmsi?: number | undefined;
  registrationId?: string | undefined;
  name?: string | undefined;
  hullLength?: number | undefined;
  hullWidth?: number | undefined;
  owner?: string | undefined;
  ersEnabled: boolean;
  gearGroupIds: number[];
  specieGroupIds: number[];
  deliveryPointIds: string[];
  currentPosition?: CurrentPosition;
  mapPlot: Feature<Geometry>;
}
