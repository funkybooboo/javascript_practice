import { configureStore } from "@reduxjs/toolkit";

import reducer from "./reducer";
import createLogger from "./middlewares/logger";
import filter from "./middlewares/filter";
import toast from "./middlewares/toast";

export type RootState = ReturnType<typeof reducer>;

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(filter)
        .concat(
            createLogger({
                collapsed: true,
                filterActions: (type) => !type.startsWith("internal/"),
                prettyPrint: true,
            })
        )
        .concat(toast)
});

export default store;
