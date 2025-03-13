import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

const func: Middleware<{}, RootState> = (store) => (next) => (action) => {
    if (typeof action === "function") {
        return action(store.dispatch, store.getState);
    } else {
        return next(action);
    }
};

export default func;
