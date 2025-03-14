import { createAction } from "@reduxjs/toolkit";

export interface ApiRequestPayload {
    url: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    data: Record<string, any>;  // Adjust based on the shape of data
    onStart?: string;
    onSuccess?: string;
    onError?: string;
}

export interface ApiSuccessPayload {
    data: any;
}

export interface ApiFailPayload {
    error: string;
}

export const requested = createAction<ApiRequestPayload>("api/requested");
export const success = createAction<ApiSuccessPayload>("api/success");
export const failed = createAction<ApiFailPayload>("api/failed");
