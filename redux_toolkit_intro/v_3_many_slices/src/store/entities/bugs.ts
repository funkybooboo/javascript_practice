import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Bug {
    id: number;
    description: string;
    is_resolved: boolean;
}

let last_id = 0;

export default createSlice({
    name: "bugs",
    initialState: [] as Bug[],
    reducers: {
        add: (bugs, action: PayloadAction<{ description: string }>) => {
            bugs.push({
                id: ++last_id,
                description: action.payload.description,
                is_resolved: false,
            });
        },
        remove: (bugs, action: PayloadAction<{ id: number }>) => {
            return bugs.filter(bug => bug.id !== action.payload.id);
        },
        resolve: (bugs, action: PayloadAction<{ id: number }>) => {
            const bug = bugs.find(bug => bug.id === action.payload.id);
            if (bug) {
                bug.is_resolved = true;
            }
        },
    }
});
