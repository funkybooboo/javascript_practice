import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface LoggerOptions {
    collapsed?: boolean;
    filterActions?: (actionType: string) => boolean;
    prettyPrint?: boolean;
}

const createLogger = (options: LoggerOptions = {}): Middleware<{}, RootState> => {
    const {
        collapsed = false,
        filterActions = () => true, // Default: log all actions
        prettyPrint = true,
    } = options;

    return (store) => (next) => (action) => {
        if (typeof action === "function") {
            console.warn("⚡ Dispatched a function action:", action.name || "[anonymous function]");
        }
        // @ts-ignore
        else if (typeof action === "object" && ("type" in action)) {
            // @ts-ignore
            if (!filterActions(action.type)) {
                return next(action);
            }

            const prevState = store.getState();
            next(action);
            const nextState = store.getState();

            const log = prettyPrint ? JSON.stringify : (data: any) => data;

            const logGroup = collapsed ? console.groupCollapsed : console.group;
            logGroup(action.type);
            console.log("%cPrevious State:", "color: gray", log(prevState, null, 4));
            console.log("%cAction:", "color: blue", action);
            console.log("%cNext State:", "color: green", log(nextState, null, 4));
            console.groupEnd();
        }
        else {
            console.warn("🚨 Received unexpected action:", action);
            return next(action);
        }
    };
};

export default createLogger;
