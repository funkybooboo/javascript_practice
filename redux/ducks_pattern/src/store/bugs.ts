// ACTIONS

enum ActionType {
    ADD_BUG = 'ADD_BUG',
    REMOVE_BUG = 'REMOVE_BUG',
    RESOLVE_BUG = 'RESOLVE_BUG',
}

// TYPES

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

// ACTION CREATORS

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

// REDUCER

let lastId = 0;

function reducer(state: Bug[] = [], action: Action): Bug[] {
    switch (action.type) {
        case ActionType.ADD_BUG:
            return [
                ...state,
                {
                    id: ++lastId,
                    description: action.payload.description,
                    is_resolved: false,
                }
            ];
        case ActionType.REMOVE_BUG:
            return state.filter(bug => bug.id !== action.payload.id);
        case ActionType.RESOLVE_BUG:
            return state.map(bug => bug.id !== action.payload.id ? bug : { ...bug, is_resolved: true } );
        default:
            return state;
    }
}

export { reducer, add_bug, resolve_bug, remove_bug };
