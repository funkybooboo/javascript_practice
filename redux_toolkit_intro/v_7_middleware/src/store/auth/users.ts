import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { userSchema } from "../schemas";
import { RootState } from "../index";

interface User {
    id: number;
    name: string;
}

interface UsersState {
    entities: Record<string, User>;
    ids: number[];
}

const initialState: UsersState = {
    entities: {},
    ids: [],
};

let lastId = 0;

const slice = createSlice({
    name: "users",
    initialState,
    reducers: {
        add: (users, action: PayloadAction<{ name: string }>) => {
            const newUser: User = {
                id: ++lastId,
                name: action.payload.name,
            };
            const normalized = normalize(newUser, userSchema);
            users.entities[normalized.result] = normalized.entities.projects![normalized.result];
            users.ids.push(normalized.result);
        },
        remove: (users, action: PayloadAction<{ id: number }>) => {
            delete users.entities[action.payload.id];
            users.ids = users.ids.filter((id) => id !== action.payload.id);
        },
    },
});

export const users = slice.actions;
export default slice.reducer;

// Selector to get unresolved bugs
export const getUsers = createSelector(
    [(state: RootState) => state.auth.users.entities],
    (users) => Object.values(users),
);
