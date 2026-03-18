import { configureStore } from "@reduxjs/toolkit";
import { asyncDispatchMiddleware } from "./asyncDispatch";
import { errorLoggerMiddleware } from "./errorLogger";
import { appReducer } from "./reducers";

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      asyncDispatchMiddleware,
      errorLoggerMiddleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
