import { configureStore } from "@reduxjs/toolkit";

import bugs_slice  from "./bugs";

export default function () {
    return configureStore({
        reducer: bugs_slice.reducer,
    });
}
