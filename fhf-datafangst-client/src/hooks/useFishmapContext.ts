import type { Map as OLMap } from "ol";
import { createContext, useContext } from "react";
import type { AisVmsPosition } from "~/generated/openapi";

export interface FishmapCtx {
  map: OLMap;
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
