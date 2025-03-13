import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { bugSchema } from "../schemas";
import { RootState } from "../index";
import * as api from "../api";
import moment from "moment";

interface Bug {
    id: number;
    project_id: number;
    description: string;
    is_resolved: boolean;
}

interface BugsState {
    entities: Record<number, Bug>;
    ids: number[];
    loading: boolean;
    lastFetch: number | null;
}

const initialState: BugsState = {
    entities: {},
    ids: [],
    loading: false,
    lastFetch: null,
};

let lastId = 0;

const slice = createSlice({
    name: "bugs",
    initialState,
    reducers: {
        requestFail: (bugs, action: PayloadAction<any>) => {
            bugs.loading = false;
        },

        request: (bugs, action: PayloadAction<any>) => {
            bugs.loading = true;
        },

        receive: (bugs, action: PayloadAction<Bug[]>) => {
            const normalized = normalize(action.payload, [bugSchema]);
            bugs.entities = normalized.entities.bugs || {};
            // Ensure bugs.ids is typed as number[]
            bugs.ids = normalized.result as number[];
            bugs.lastFetch = Date.now();
            bugs.loading = false;
        },

        add: (bugs, action: PayloadAction<{ project_id: number; description: string }>) => {
            const newBug: Bug = {
                id: ++lastId,
                project_id: action.payload.project_id,
                description: action.payload.description,
                is_resolved: false,
            };
            const normalized = normalize(newBug, bugSchema);
            const bugId = normalized.result as number;
            bugs.entities[bugId] = normalized.entities.bugs![bugId];
            bugs.ids.push(bugId);
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

const url = '/bugs';

// Thunk to add a bug
export const addBug = (bug: { project_id: number; description: string }) => (dispatch: Dispatch) => {
    return dispatch(
        api.request({
            url,
            method: 'post',
            data: bug,
            onSuccess: slice.actions.add.type,
        })
    );
};

// Thunk to get bugs from the API
export const getBugs = () => (dispatch: Dispatch, getState: () => RootState) => {
    const { lastFetch } = getState().entities.bugs;
    // If lastFetch exists and diff is less than 10 minutes, skip fetching.
    if (lastFetch && moment().diff(moment(lastFetch), 'minutes') < 10) return;

    return dispatch(
        api.request({
            url,
            method: 'get',
            data: {},
            onStart: slice.actions.request.type,
            onSuccess: slice.actions.receive.type,
            onError: slice.actions.requestFail.type,
        })
    );
};
