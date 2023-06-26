import { Feature, Map } from "ol";

export enum ViewMode {
  Grid = "grid",
  Heatmap = "heatmap",
}

export interface FishmapState {
  map: Map;
  centerCoordinate: number[];
  zoomLevel: number;
  zoomLevelTouch: number;
  zoomFactor: number;
  selectedGrids: Feature[];
  selectedGridsString: string[];
  viewMode: ViewMode;
  seamapCapabilities?: string;
}

export const initialFishmapState: FishmapState = {
  map: new Map({}),
  centerCoordinate: [1904373.32, 10399403.38],
  zoomLevel: 2.7,
  zoomLevelTouch: 2.2,
  zoomFactor: 3.7,
  selectedGrids: [],
  selectedGridsString: [],
  viewMode: ViewMode.Grid,
  seamapCapabilities: undefined,
};
