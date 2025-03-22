import {ActionType, AddBugAction, RemoveBugAction, ResolveBugAction} from "./types";

function add_bug(description: string): AddBugAction {
    return {
        type: ActionType.ADD_BUG,
        payload: {
            description
        }
    };
}

function remove_bug(id: number): RemoveBugAction {
    return {
        type: ActionType.REMOVE_BUG,
        payload: {
            id
        }
    };
}

function resolve_bug(id: number): ResolveBugAction {
    return {
        type: ActionType.RESOLVE_BUG,
        payload: {
            id
        }
    };
}

export { add_bug, remove_bug, resolve_bug };
