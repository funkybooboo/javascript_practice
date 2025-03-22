import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

const func: Middleware<{}, RootState> = (store) => (next) => (action) => {
    if (typeof action === "function") {
        action(store.dispatch, store.getState);
    } else {
        next(action);
    }
};

export default func;
