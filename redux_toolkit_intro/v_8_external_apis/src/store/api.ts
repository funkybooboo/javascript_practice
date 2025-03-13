// actions.ts
import { createAction, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the action payloads
export interface ApiRequestPayload {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete';  // Can extend based on methods you use
    data: Record<string, any>;  // Adjust based on the shape of data
    onSuccess?: string;
    onError?: string;
}

export interface ApiSuccessPayload {
    data: any;
}

export interface ApiFailPayload {
    error: any;
}

// Create the actions
export const apiRequest = createAction<ApiRequestPayload>("api/request");
export const apiSuccess = createAction<ApiSuccessPayload>("api/success");
export const apiFail = createAction<ApiFailPayload>("api/fail");
