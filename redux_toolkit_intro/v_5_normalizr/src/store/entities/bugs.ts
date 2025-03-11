import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { bugSchema } from "../schemas";
import {RootState} from "../index";

interface Bug {
    id: number;
    project_id: number;
    description: string;
    is_resolved: boolean;
}

interface BugsState {
    entities: Record<string, Bug>;
    ids: number[];
}

const initialState: BugsState = {
    entities: {},
    ids: [],
};

let lastId = 0;

const slice = createSlice({
    name: "bugs",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<{ project_id: number; description: string }>) => {
            const newBug: Bug = {
                id: ++lastId,
                project_id: action.payload.project_id,
                description: action.payload.description,
                is_resolved: false,
            };
            const normalized = normalize(newBug, bugSchema);
            state.entities[normalized.result] = normalized.entities.bugs![normalized.result];
            state.ids.push(normalized.result);
        },
        remove: (state, action: PayloadAction<{ id: number }>) => {
            delete state.entities[action.payload.id];
            state.ids = state.ids.filter((id) => id !== action.payload.id);
        },
        resolve: (state, action: PayloadAction<{ id: number }>) => {
            const bug = state.entities[action.payload.id];
            if (bug) {
                bug.is_resolved = true;
            }
        },
    },
});

export const bugs = slice.actions;
export default slice.reducer

// Selector

export const getUnresolvedBugs = (state: RootState): Bug[] => {
    return Object.values(state.entities.bugs.entities).filter((bug: Bug) => !bug.is_resolved);
};
