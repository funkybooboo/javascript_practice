import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

const toast: Middleware<{}, RootState> = (store) => (next) => (action) => {
    // @ts-ignore
    if (typeof action === "object" && ("type" in action)) {
        // @ts-ignore
        if (action.type === 'error' && ("payload" in action) && ("message" in action.payload)) {
            console.log("Toastify", action.payload.message);
        }
    } else {
        return next(action);
    }
};

export default toast;
