import { Middleware } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const errorLoggerMiddleware: Middleware<object, AppState> =
  () => (next) => (action) => {
    if ((action as any).meta?.requestStatus === "rejected") {
      console.error(action);
    }

    return next(action);
  };
