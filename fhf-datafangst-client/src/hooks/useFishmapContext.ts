import type { Map as OLMap } from "ol";
import type Feature from "ol/Feature";
import type { FeatureLike } from "ol/Feature";
import type { Geometry } from "ol/geom";
import RenderFeature from "ol/render/Feature";
import { createContext, useContext } from "react";
import type { AisVmsPosition } from "~/generated/openapi";

// Background map from Mapbox returns as RenderFeature.
export const pixelFeature = (
  feature: FeatureLike,
): Feature<Geometry> | undefined =>
  feature instanceof RenderFeature ? undefined : feature;

export interface FishmapCtx {
  map: OLMap;
  zoom: number;
  defaultCenter: [number, number];
  defaultZoom: number;
  defaultZoomFactor: number;
  resetZoom: () => void;
  focusTrack: (track: AisVmsPosition[]) => void;
}

export const FishmapContext = createContext<FishmapCtx | undefined>(undefined);

export function useFishmapContext() {
  const ctx = useContext(FishmapContext);
  if (!ctx) {
    throw new Error(
      "useFishmapContext must be used within a FishmapContext Provider",
    );
  }
  return ctx;
}
