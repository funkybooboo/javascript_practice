import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { normalize } from "normalizr";
import { projectSchema } from "../schemas";
import {RootState} from "../index";

type Status = "todo" | "doing" | "done";

interface Project {
    id: number;
    name: string;
    status: Status;
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
        add: (state, action: PayloadAction<{ name: string }>) => {
            const newProject: Project = {
                id: ++lastId,
                name: action.payload.name,
                status: "todo",
            };
            const normalized = normalize(newProject, projectSchema);
            state.entities[normalized.result] = normalized.entities.projects![normalized.result];
            state.ids.push(normalized.result);
        },
        remove: (state, action: PayloadAction<{ id: number }>) => {
            delete state.entities[action.payload.id];
            state.ids = state.ids.filter((id) => id !== action.payload.id);
        },
        update: (state, action: PayloadAction<{ id: number; status: Status }>) => {
            const project = state.entities[action.payload.id];
            if (project) {
                project.status = action.payload.status;
            }
        },
    },
});

export const projects = slice.actions;
export default slice.reducer

export const getNoncompleteProjects = (state: RootState): Project[] => {
    return Object.values(state.entities.projects.entities).filter((project: Project) => project.status !== 'done');
};
