import { createAction } from "@reduxjs/toolkit";
import { Map } from "ol";

export const initializeMap = createAction<Map>("fishmap/initializeMap");
