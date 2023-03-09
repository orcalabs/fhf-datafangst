import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { GearGroup, HaulCatch, SpeciesGroup } from "generated/openapi";
import { LengthGroup } from "models";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { inRange, sumHaulCatches } from "utils";
import { getHauls, getHaulsGrid, setHaulsFilter, setHaulsSearch } from ".";

export const haulBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHauls.pending, (state, _) => {
      state.haulsLoading = true;
      state.hauls = undefined;
    })
    .addCase(getHauls.fulfilled, (state, action) => {
      const hauls = action.payload;
      state.hauls = hauls;
      state.filteredHauls = hauls;

      state.haulsByArea = {};
      for (const haul of hauls) {
        if (haul.catchLocationStart) {
          if (state.haulsByArea[haul.catchLocationStart]) {
            state.haulsByArea[haul.catchLocationStart].push(haul);
          } else {
            state.haulsByArea[haul.catchLocationStart] = [haul];
          }
        }
      }

      state.haulsLoading = false;
    })
    .addCase(getHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(getHaulsGrid.pending, (state, _) => {
      state.haulsGridLoading = true;
      state.haulsGrid = undefined;
    })
    .addCase(getHaulsGrid.fulfilled, (state, action) => {
      state.haulsGrid = action.payload;
      state.haulsGridLoading = false;
    })
    .addCase(getHaulsGrid.rejected, (state, _) => {
      state.haulsGridLoading = false;
    })
    .addCase(setHaulsSearch, (state, action) => {
      if (action.payload) {
        (action as any).asyncDispatch(getHauls(action.payload));
      }

      return {
        ...state,
        ...emptyState,
        haulsSearch: action.payload,
      };
    })
    .addCase(setHaulsFilter, (state, action) => {
      const filters2: Record<any, any> = { ...action.payload };

      // Return full haul list if no filters are selected
      if (Object.values(filters2).every((val) => val === undefined)) {
        return {
          ...state,
          haulsFilter: {},
          filteredHauls: state.hauls,
        };
      }
      const filters = action.payload;
      // Filter hauls
      const filteredHauls = state.hauls?.filter((haul) => {
        if (
          (!filters.gearGroups ||
            filters.gearGroups.some(
              (g: GearGroup) => g.id === haul.gearGroupId,
            )) &&
          (!filters.speciesGroups ||
            filters.speciesGroups.some((s: SpeciesGroup) => {
              return haul.catches.some(
                (c: HaulCatch) => c.speciesGroupId === s.id,
              );
            })) &&
          (!filters.weight ||
            inRange(
              sumHaulCatches(haul.catches),
              filters.weight[0],
              filters.weight[1],
            )) &&
          (!filters.lengthGroups ||
            filters.lengthGroups.some((lg: LengthGroup) =>
              inRange(haul.vesselLength, lg.min, lg.max),
            ))
        ) {
          return true;
        } else {
          return false;
        }
      });

      return {
        ...state,
        haulsFilter: action.payload,
        filteredHauls,
      };
    });
