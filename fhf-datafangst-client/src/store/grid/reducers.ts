import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { Style } from "ol/style";
import type { AppState } from "~/store/state";
import { emptyState } from "~/store/state";
import { generateGridBoxStyle } from "~/utils";
import { toggleSelectedArea } from "./actions";

export const gridBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(toggleSelectedArea, (state, action) => {
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
