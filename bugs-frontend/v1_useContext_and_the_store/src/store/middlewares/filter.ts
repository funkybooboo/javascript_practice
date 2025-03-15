import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

const filter: Middleware<{}, RootState> = (store) => (next) => (action) => {
    if (action === null || action === undefined) {
        console.warn("🚨 Received null or undefined action");
        return;
    }
    return next(action);
};

export default filter;
