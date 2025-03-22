import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { projectSchema } from "../schemas";
import { RootState } from "../index";
import {getUsers} from "../auth/users";

type Status = "todo" | "doing" | "done";

interface Project {
    id: number;
    name: string;
    status: Status;
    user_ids: number[]; // Users assigned to this project
}

interface ProjectsState {
    entities: Record<string, Project>;
    ids: number[];
}

const initialState: ProjectsState = {
    entities: {},
    ids: [],
};

let lastId = 0;

const slice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        add: (
            projects,
            action: PayloadAction<{ name: string; user_ids?: number[] }>
        ) => {
            const newProject: Project = {
                id: ++lastId,
                name: action.payload.name,
                status: "todo",
                user_ids: action.payload.user_ids || [], // Assign users if provided
            };
            const normalized = normalize(newProject, projectSchema);
            projects.entities[normalized.result] =
                normalized.entities.projects![normalized.result];
            projects.ids.push(normalized.result);
        },
        remove: (projects, action: PayloadAction<{ id: number }>) => {
            delete projects.entities[action.payload.id];
            projects.ids = projects.ids.filter((id) => id !== action.payload.id);
        },
        update: (
            projects,
            action: PayloadAction<{ id: number; status?: Status; user_ids?: number[] }>
        ) => {
            const project = projects.entities[action.payload.id];
            if (project) {
                if (action.payload.status) {
                    project.status = action.payload.status;
                }
                if (action.payload.user_ids) {
                    project.user_ids = action.payload.user_ids; // Update assigned users
                }
            }
        },
    },
});

export const projects = slice.actions;
export default slice.reducer;

// Select project entities
const getProjects = (state: RootState) => state.entities.projects.entities;

// Selector to get projects with assigned users
export const getProjectsWithUsers = createSelector(
    [getProjects, getUsers],
    (projects, users) =>
        Object.values(projects).map((project) => ({
            ...project,
            users: project.user_ids.map((user_id) => users[user_id]), // Map user IDs to user objects
        }))
);

// Selector to get unresolved bugs
export const getUncompleteProjects = createSelector(
    [getProjects],
    (projects) => Object.values(projects).filter((project) => project.status !== 'done')
);

export const getUnassignedUncompleteProjects = createSelector(
    [getProjects],
    (projects) =>
        Object.values(projects).filter(
            (project) => project.status !== "done" && project.user_ids.length === 0
        )
);
