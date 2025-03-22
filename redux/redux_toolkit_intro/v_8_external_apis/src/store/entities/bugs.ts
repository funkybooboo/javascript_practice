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

const slice = createSlice({
    name: "bugs",
    initialState,
    reducers: {
        apiRequestFailed: (bugs, action: PayloadAction<any>) => {
            bugs.loading = false;
        },

        apiRequestBegin: (bugs, action: PayloadAction<any>) => {
            bugs.loading = true;
        },

        apiResponseReceived: (bugs, action: PayloadAction<Bug[]>) => {
            const normalized = normalize(action.payload, [bugSchema]);
            bugs.entities = normalized.entities.bugs || {};
            bugs.ids = normalized.result as number[];
            bugs.lastFetch = Date.now();
            bugs.loading = false;
        },

        added: (bugs, action: PayloadAction<{ project_id: number; description: string }>) => {
            const newBug: Bug = {
                id: bugs.lastFetch!,
                project_id: action.payload.project_id,
                description: action.payload.description,
                is_resolved: false,
            };
            const normalized = normalize(newBug, bugSchema);
            const bugId = normalized.result as number;
            bugs.entities[bugId] = normalized.entities.bugs![bugId];
            bugs.ids.push(bugId);
        },

        assigned: (bugs, action: PayloadAction<{ id: number; project_id: number }>) => {
            const bug = bugs.entities[action.payload.id];
            if (bug) {
                bug.project_id = action.payload.project_id;
            }
        },

        removed: (bugs, action: PayloadAction<{ id: number }>) => {
            delete bugs.entities[action.payload.id];
            bugs.ids = bugs.ids.filter((id) => id !== action.payload.id);
        },

        resolved: (bugs, action: PayloadAction<{ id: number }>) => {
            const bug = bugs.entities[action.payload.id];
            if (bug) {
                bug.is_resolved = true;
            }
        },
    },
});

export default slice.reducer;

export const selectUnresolvedBugs = createSelector(
    [(state: RootState) => state.entities.bugs.entities],
    (bugs) => Object.values(bugs).filter((bug) => !bug.is_resolved)
);

const url = '/bugs';

export const addBug = (bug: { project_id: number; description: string }) => (dispatch: Dispatch) => dispatch(
    api.requested({
        url,
        method: 'post',
        data: bug,
        onSuccess: slice.actions.added.type,
    })
);

export const resolveBug = (id: number) => (dispatch: Dispatch) => dispatch(
    api.requested({
        url: `${url}/${id}`,
        method: 'patch',
        data: { is_resolved: true },
        onSuccess: slice.actions.resolved.type,
    })
);

export const assignBugToProject = (id: number, project_id: number) => (dispatch: Dispatch) => dispatch(
    api.requested({
        url: `${url}/${id}`,
        method: 'patch',
        data: { project_id },
        onSuccess: slice.actions.assigned.type,
    })
);

export const loadBugs = () => (dispatch: Dispatch, getState: () => RootState) => {
    const { lastFetch } = getState().entities.bugs;
    // If lastFetch exists and diff is less than 10 minutes, skip fetching.
    if (lastFetch && moment().diff(moment(lastFetch), 'minutes') < 10) return;

    return dispatch(
        api.requested({
            url,
            method: 'get',
            data: {},
            onStart: slice.actions.apiRequestBegin.type,
            onSuccess: slice.actions.apiResponseReceived.type,
            onError: slice.actions.apiRequestFailed.type,
        })
    );
};
