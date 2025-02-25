import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Style } from "ol/style";
import { AppState, emptyState } from "store/state";
import { generateGridBoxStyle } from "utils";
import {
  initializeMap,
  setInitialMapZoom,
  toggleSelectedArea,
} from "./actions";
import { initialFishmapState } from "./state";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(initializeMap, (state, action) => {
      state.map = action.payload;
    })
    .addCase(setInitialMapZoom, (state, _) => {
      state.map.getView().setZoom(initialFishmapState.zoomFactor);
      state.map.getView().setCenter(initialFishmapState.centerCoordinate);
      state.map.getView().setResolution(4576);
    })
    .addCase(toggleSelectedArea, (state, action) => {
      const selected = [...state.selectedGrids];
      const selectedStrings = [...state.selectedGridsString];
      const area = action.payload;
      const areaString = area.get("lokref");

      const index = selected.findIndex(
        (a) => a.get("objectid") === area.get("objectid"),
      );
      if (index < 0) {
        const style = area.getStyle() as Style;
        const color = style.getFill()?.getColor()?.toString();
        area.setStyle(generateGridBoxStyle(area.get("weight"), color!, true));
        area.setProperties({ color });
        selected.push(area);
      } else {
        const removed = selected.splice(index, 1)[0];
        removed.setStyle(
          generateGridBoxStyle(removed.get("weight"), removed.get("color")),
        );
      }

      const indexStrings = selectedStrings.indexOf(areaString);
      if (indexStrings < 0) {
        selectedStrings.push(areaString);
      } else {
        selectedStrings.splice(indexStrings, 1);
      }

      return {
        ...state,
        ...emptyState,
        ...(selected.length
          ? {
              hauls: state.hauls,
              landings: state.landings,
            }
          : {
              haulsMatrix2Search: undefined,
              landingsMatrix2Search: undefined,
            }),
        selectedGrids: selected,
        selectedGridsString: selectedStrings,
      };
    });
