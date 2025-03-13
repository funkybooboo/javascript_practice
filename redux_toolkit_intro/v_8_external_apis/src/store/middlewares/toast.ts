import { Middleware, Action } from "@reduxjs/toolkit";
import { RootState } from "../index";

const toast: Middleware<{}, RootState> = (store) => (next) => (action: unknown) => {
    const typedAction = action as Action & { payload?: any };
    if (
        typedAction.type === "error" &&
        typedAction.payload &&
        typeof typedAction.payload === "object" &&
        "message" in typedAction.payload
    ) {
        console.log("toast", typedAction.payload.message);
    }
    return next(action);
};

export default toast;
