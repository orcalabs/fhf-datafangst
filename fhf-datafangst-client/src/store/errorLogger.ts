import { AnyAction } from "@reduxjs/toolkit";

export const errorLoggerMiddleware =
  () => (next: any) => (action: AnyAction) => {
    if (action.meta?.requestStatus === "rejected") {
      console.error(action);
    }

    return next(action);
  };
