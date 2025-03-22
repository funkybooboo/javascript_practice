import { configureStore } from "@reduxjs/toolkit";

import reducer from "./reducer";
import createLogger from "./middlewares/logger";
import filter from "./middlewares/filter";
import toast from "./middlewares/toast";
import api from "./middlewares/api";

export type RootState = ReturnType<typeof reducer>;

function configure_store() {
    return configureStore({
        reducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                filter,
                createLogger({ collapsed: false, prettyPrint: true }),
                api,
            )
    });
}

export default configure_store;
