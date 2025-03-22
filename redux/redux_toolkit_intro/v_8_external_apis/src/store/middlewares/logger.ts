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

    return (store) => (next) => (action: unknown) => {
        // If the action is a function (e.g. a thunk), log its name and invoke it.
        if (typeof action === "function") {
            console.log("⚡ Dispatched a function action:", action.name || "[anonymous function]");
            next(action);
        }
        // Check that action is an object with a "type" property.
        else if (action && typeof action === "object" && "type" in action) {
            // Cast action to an object with a type string.
            const actionWithType = action as { type: string };

            if (!filterActions(actionWithType.type)) {
                return next(action);
            }

            const prevState = store.getState();
            const result = next(action);
            const nextState = store.getState();

            const log = prettyPrint
                ? (data: any) => JSON.stringify(data, null, 4)
                : (data: any) => data;

            const logGroup = collapsed ? console.groupCollapsed : console.group;
            logGroup(actionWithType.type);
            console.log("%cPrevious State:", "color: gray", log(prevState));
            console.log("%cAction:", "color: blue", action);
            console.log("%cNext State:", "color: green", log(nextState));
            console.groupEnd();

            return result;
        }
        else {
            console.warn("🚨 Received unexpected action:", action);
            return next(action);
        }
    };
};

export default createLogger;
