import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { generateGridBoxStyle } from "utils";
import { initializeMap, toggleSelectedArea } from ".";

export const fishmapBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(initializeMap, (state, action) => {
      state.map = action.payload;
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
        if (state.haulsGrid) {
          area.setStyle(
            generateGridBoxStyle(
              areaString,
              state.haulsGrid.grid[areaString],
              state.haulsGrid.maxWeight,
              true,
            ),
          );
        }
        selected.push(area);
      } else {
        const removed = selected.splice(index, 1);
        if (state.haulsGrid) {
          removed[0].setStyle(
            generateGridBoxStyle(
              areaString,
              state.haulsGrid.grid[areaString],
              state.haulsGrid.maxWeight,
            ),
          );
        }

        removed[0].changed();
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
