import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { Vessel } from "generated/openapi";
import { AppState } from "store/state";
import { getCurrentTrip, getTrips } from "store/trip";
import {
  getEstimatedFuelConsumption,
  getVesselBenchmarks,
  getVessels,
  setSelectedLiveVessel,
} from "./actions";

export const vesselBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getVessels.fulfilled, (state, action) => {
      const vessels = action.payload;
      state.vessels = vessels;
      state.vesselsByCallSign = {};
      state.vesselsByFiskeridirId = {};
      state.vesselsByMmsi = {};
      for (const vessel of vessels) {
        if (vessel.fiskeridir?.callSign) {
          state.vesselsByCallSign[vessel.fiskeridir.callSign] = vessel;
        }

        if (vessel.fiskeridir?.id) {
          state.vesselsByFiskeridirId[vessel.fiskeridir.id] = vessel;
        }

        if (vessel.ais) {
          state.vesselsByMmsi[vessel.ais.mmsi] = vessel;
        }
      }
    })
    .addCase(getVesselBenchmarks.fulfilled, (state, action) => {
      state.vesselBenchmarks = action.payload;
    })
    .addCase(getEstimatedFuelConsumption.fulfilled, (state, action) => {
      state.estimatedFuelConsumption = action.payload;
    })
    .addCase(setSelectedLiveVessel, (state, action) => {
      let vessel: Vessel | undefined;
      if (action.payload) {
        vessel = current(state.vesselsByMmsi?.[action.payload.mmsi]) as
          | Vessel
          | undefined;

        if (vessel) {
          (action as any).asyncDispatch(getTrips({ vessels: [vessel] }));
          (action as any).asyncDispatch(getCurrentTrip({ vessel: vessel }));
        }
      }

      return {
        ...state,
        selectedLiveVessel: action.payload,
        tripsSearch: vessel ? { vessels: [vessel] } : undefined,
      };
    });
