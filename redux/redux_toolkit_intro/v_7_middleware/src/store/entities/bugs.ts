import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
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
        add: (bugs, action: PayloadAction<{ project_id: number; description: string }>) => {
            const newBug: Bug = {
                id: ++lastId,
                project_id: action.payload.project_id,
                description: action.payload.description,
                is_resolved: false,
            };
            const normalized = normalize(newBug, bugSchema);
            bugs.entities[normalized.result] = normalized.entities.bugs![normalized.result];
            bugs.ids.push(normalized.result);
        },
        remove: (bugs, action: PayloadAction<{ id: number }>) => {
            delete bugs.entities[action.payload.id];
            bugs.ids = bugs.ids.filter((id) => id !== action.payload.id);
        },
        resolve: (bugs, action: PayloadAction<{ id: number }>) => {
            const bug = bugs.entities[action.payload.id];
            if (bug) {
                bug.is_resolved = true;
            }
        },
    },
});

export const bugs = slice.actions;
export default slice.reducer;

// Selector to get unresolved bugs
export const getUnresolvedBugs = createSelector(
    [(state: RootState) => state.entities.bugs.entities],
    (bugs) => Object.values(bugs).filter((bug) => !bug.is_resolved)
);
