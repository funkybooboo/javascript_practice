import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Status = "todo" | "doing" | "done";

interface Project {
    id: number;
    name: string;
    status: Status;
}

let last_id = 0;

export default createSlice({
    name: "projects",
    initialState: [] as Project[],
    reducers: {
        add: (state, action: PayloadAction<{ name: string }>) => {
            state.push({
                id: ++last_id,
                name: action.payload.name,
                status: "todo"
            });
        },
        remove: (projects, action: PayloadAction<{ id: number }>) => {
            return projects.filter(project => project.id !== action.payload.id);
        },
        update: (projects, action: PayloadAction<{ id: number, status: Status }>) => {
            let project = projects.find(project => project.id === action.payload.id);
            if (project) project.status = action.payload.status;
        },
    }
});
