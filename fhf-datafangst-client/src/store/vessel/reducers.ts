import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { Vessel } from "generated/openapi";
import { AppState } from "store/state";
import { getCurrentTrip, getTrips } from "store/trip";
import {
  getEstimatedFuelConsumption,
  getEstimatedLiveFuelConsumption,
  getVesselBenchmarks,
  getVessels,
  setSelectedLiveVessel,
  updateVessel,
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
    .addCase(getEstimatedFuelConsumption.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(getEstimatedFuelConsumption.fulfilled, (state, action) => {
      state.estimatedFuelConsumption = action.payload;
    })
    .addCase(getEstimatedLiveFuelConsumption.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
    })
    .addCase(getEstimatedLiveFuelConsumption.fulfilled, (state, action) => {
      state.estimatedLiveFuelConsumption = action.payload;
    })
    .addCase(updateVessel.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      action.meta.arg.callSignOverride = state.bwUser?.fiskInfoProfile.ircs;
    })
    .addCase(updateVessel.fulfilled, (state, action) => {
      const vessel = action.payload;
      if (state.vessels) {
        const idx = state.vessels.findIndex(
          (v) => v.fiskeridir.id === vessel.fiskeridir.id,
        );
        state.vessels[idx] = vessel;
      }
      if (state.vesselsByCallSign && vessel.fiskeridir.callSign) {
        state.vesselsByCallSign[vessel.fiskeridir.callSign] = vessel;
      }

      if (state.vesselsByMmsi && vessel.ais?.mmsi) {
        state.vesselsByMmsi[vessel.ais.mmsi] = vessel;
      }

      if (state.vesselsByFiskeridirId && vessel.fiskeridir.id)
        state.vesselsByFiskeridirId[vessel.fiskeridir.id] = vessel;
    })
    .addCase(setSelectedLiveVessel, (state, action) => {
      let vessel: Vessel | undefined;
      if (action.payload) {
        vessel = current(
          state.vesselsByFiskeridirId?.[action.payload.vesselId],
        ) as Vessel | undefined;

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
