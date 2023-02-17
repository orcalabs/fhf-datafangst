import { AnyAction } from "@reduxjs/toolkit";

export const asyncDispatchMiddleware =
  (store: any) => (next: any) => (action: AnyAction) => {
    let syncActivityFinished = false;
    let actionQueue: AnyAction[] = [];

    function flushQueue() {
      actionQueue.forEach((a) => store.dispatch(a));
      actionQueue = [];
    }

    function asyncDispatch(asyncAction: AnyAction) {
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
