import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getDeliveryPoints = createAsyncThunk(
  "deliveryPoint/getDeliveryPoints",
  Api.getDeliveryPoints,
);
