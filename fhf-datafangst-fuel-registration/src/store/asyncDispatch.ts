import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { AppState } from "./state";

export const asyncDispatchMiddleware: Middleware<object, AppState> =
  (store) => (next) => (action) => {
    let syncActivityFinished = false;
    let actionQueue: UnknownAction[] = [];

    function flushQueue() {
      actionQueue.forEach((a) => store.dispatch(a));
      actionQueue = [];
    }

    function asyncDispatch(asyncAction: UnknownAction) {
      actionQueue = actionQueue.concat([asyncAction]);

      if (syncActivityFinished) {
        flushQueue();
      }
    }

    const actionWithAsyncDispatch = Object.assign({}, action, {
      asyncDispatch,
    });

    const res = next(actionWithAsyncDispatch);

    syncActivityFinished = true;
    flushQueue();

    return res;
  };
