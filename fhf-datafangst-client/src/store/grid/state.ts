import type { Feature } from "ol";

export interface GridState {
  selectedGrids: Feature[];
  selectedGridsString: string[];
}

export const initialGridState: GridState = {
  selectedGrids: [],
  selectedGridsString: [],
};
