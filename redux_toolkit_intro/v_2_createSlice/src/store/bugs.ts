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
        add: (state, action: PayloadAction<{ description: string }>) => {
            state.push({
                id: ++last_id,
                description: action.payload.description,
                is_resolved: false,
            });
        },
        remove: (state, action: PayloadAction<{ id: number }>) => {
            return state.filter(bug => bug.id !== action.payload.id);
        },
        resolve: (state, action: PayloadAction<{ id: number }>) => {
            const bug = state.find(bug => bug.id === action.payload.id);
            if (bug) {
                bug.is_resolved = true;
            }
        },
    }
});
