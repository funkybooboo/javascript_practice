import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { projectSchema } from "../schemas";
import { RootState } from "../index";
import { selectUsers } from "../auth/users";

type Status = "todo" | "doing" | "done";

interface Project {
    id: number;
    name: string;
    status: Status;
    user_ids: number[]; // Users assigned to this project
}

interface ProjectsState {
    entities: Record<number, Project>;
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
        added: (
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
            const projectId = normalized.result as number;
            projects.entities[projectId] =
                normalized.entities.projects![projectId];
            projects.ids.push(projectId);
        },
        removed: (projects, action: PayloadAction<{ id: number }>) => {
            delete projects.entities[action.payload.id];
            projects.ids = projects.ids.filter((id) => id !== action.payload.id);
        },
        updated: (
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

// Selector for project entities
const selectProjects = (state: RootState) => state.entities.projects.entities;

// Selector to get projects with assigned user objects
export const getProjectsWithUsers = createSelector(
    [selectProjects, selectUsers],
    (projects, users) =>
        Object.values(projects).map((project) => ({
            ...project,
            users: project.user_ids.map((user_id) => users[user_id]),
        }))
);

// Selector to get incomplete projects (status !== "done")
export const selectUncompleteProjects = createSelector(
    [selectProjects],
    (projects) => Object.values(projects).filter((project) => project.status !== "done")
);

// Selector to get incomplete projects that have no assigned users
export const selectUnassignedUncompleteProjects = createSelector(
    [selectProjects],
    (projects) =>
        Object.values(projects).filter(
            (project) => project.status !== "done" && project.user_ids.length === 0
        )
);
