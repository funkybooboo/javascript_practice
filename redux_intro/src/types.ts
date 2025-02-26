interface Bug {
    id: number;
    description: string;
    is_resolved: boolean;
}

interface AddBugAction {
    type: ActionType.ADD_BUG;
    payload: {
        description: string;
    };
}

interface RemoveBugAction {
    type: ActionType.REMOVE_BUG;
    payload: {
        id: number;
    };
}

interface ResolveBugAction {
    type: ActionType.RESOLVE_BUG;
    payload: {
        id: number;
    };
}

type Action = AddBugAction | RemoveBugAction | ResolveBugAction;

enum ActionType {
    ADD_BUG = 'ADD_BUG',
    REMOVE_BUG = 'REMOVE_BUG',
    RESOLVE_BUG = 'RESOLVE_BUG',
}

export { Bug, Action, AddBugAction, RemoveBugAction, ResolveBugAction, ActionType };
