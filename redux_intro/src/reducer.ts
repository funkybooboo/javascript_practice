import {Action, ActionType, Bug} from "./types";

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

export default reducer;
