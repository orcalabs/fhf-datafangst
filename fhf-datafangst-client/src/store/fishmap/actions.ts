import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Feature, Map } from "ol";
import { ViewMode } from "store";

export const initializeMap = createAction<Map>("fishmap/initializeMap");

export const toggleSelectedArea = createAction<Feature>(
  "fishmap/toggleSelectedArea",
);

export const setViewMode = createAction<ViewMode>("base/setViewMode");

export const getSeamapCapabilities = createAsyncThunk(
  "base/getSeamapCapabilties",
  async () => {
    try {
      const response = await axios.get(
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities",
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
);
