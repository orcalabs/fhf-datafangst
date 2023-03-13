import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Stroke, Style } from "ol/style";
import { AppState } from "store/state";
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
        const style = area.getStyle() as Style;
        style.setStroke(new Stroke({ color: "#ffffff", width: 2 }));
        style.setZIndex(1000);
        area.changed();
        selected.push(area);
      } else {
        const removed = selected.splice(index, 1);
        const style = removed[0].getStyle() as Style;
        style.setStroke(new Stroke({ color: "rgba(255, 0, 0, 0)" }));
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
        selectedGrids: selected,
        selectedGridsString: selectedStrings,
      };
    });
