import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Style } from "ol/style";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { generateGridBoxStyle } from "utils";
import { initializeMap, setViewMode, toggleSelectedArea } from ".";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(initializeMap, (state, action) => {
      state.map = action.payload;
    })
    .addCase(setViewMode, (state, action) => {
      state.viewMode = action.payload;
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
        const color = style.getFill().getColor()?.toString();
        area.setStyle(
          generateGridBoxStyle(areaString, area.get("weight"), color!, true),
        );
        area.setProperties({ color });
        selected.push(area);
      } else {
        const removed = selected.splice(index, 1)[0];
        removed.setStyle(
          generateGridBoxStyle(
            areaString,
            removed.get("weight"),
            removed.get("color"),
          ),
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
        selectedGrids: selected,
        selectedGridsString: selectedStrings,
      };
    });
