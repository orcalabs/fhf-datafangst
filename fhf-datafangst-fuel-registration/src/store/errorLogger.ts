import { Middleware } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const errorLoggerMiddleware: Middleware<object, AppState> =
  () => (next) => (action) => {
    if ((action as any).meta?.requestStatus === "rejected") {
      if ((action as any).error?.code === "ERR_CANCELED") {
        // Ignore errors caused by cancellation
        console.log("action cancelled", action);
        return;
      } else {
        console.error(action);
      }
    }

    return next(action);
  };
