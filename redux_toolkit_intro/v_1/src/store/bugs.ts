import { createAction, createReducer } from "@reduxjs/toolkit";

// ACTION CREATORS
export const add_bug = createAction<{ description: string }>("ADD_BUG");
export const remove_bug = createAction<{ id: number }>("REMOVE_BUG");
export const resolve_bug = createAction<{ id: number }>("RESOLVE_BUG");

// TYPES
interface Bug {
    id: number;
    description: string;
    is_resolved: boolean;
}

// REDUCER
let lastId = 0;

export const reducer = createReducer<Bug[]>([], (builder) => {
    builder
        .addCase(add_bug, (bugs, action) => {
            bugs.push({
                id: ++lastId,
                description: action.payload.description,
                is_resolved: false,
            });
        })
        .addCase(remove_bug, (bugs, action) => {
            return bugs.filter(bug => bug.id !== action.payload.id);
        })
        .addCase(resolve_bug, (bugs, action) => {
            const bug = bugs.find(bug => bug.id === action.payload.id);
            if (bug) {
                bug.is_resolved = true;
            }
        });
});
