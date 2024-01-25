import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Style } from "ol/style";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { generateGridBoxStyle } from "utils";
import {
  clearAreaDrawing,
  getAreaTraffic,
  initializeMap,
  setAreaDrawActive,
  toggleSelectedArea,
} from ".";
import Draw from "ol/interaction/Draw";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(initializeMap, (state, action) => {
      state.map = action.payload;
    })
    .addCase(getAreaTraffic.fulfilled, (state, action) => {
      state.areaTraffic = action.payload;
    })
    .addCase(setAreaDrawActive, (state, action) => {
      state.areaDrawActive = action.payload;
    })
    .addCase(clearAreaDrawing, (state, _) => {
      state.areaDrawActive = false;
      state.areaTraffic = undefined;
      state.map.getInteractions().forEach((interaction) => {
        if (interaction instanceof Draw) {
          state.map.removeInteraction(interaction);
        }
      });
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
        hauls: selected.length ? state.hauls : undefined,
        landings: selected.length ? state.landings : undefined,
        selectedGrids: selected,
        selectedGridsString: selectedStrings,
      };
    });
