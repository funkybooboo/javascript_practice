import axios from "axios";
import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../";
import { request, success, fail, ApiRequestPayload } from "../api";
import { PayloadAction } from "@reduxjs/toolkit";

const api: Middleware<{}, RootState> = ({ dispatch }) => (next) => async (action) => {

    const typedAction = action as PayloadAction<ApiRequestPayload>;

    if (typedAction.type !== request.type) {
        return next(action);
    }

    const { url, method, data, onStart, onSuccess, onError } = typedAction.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
        const response = await axios.request({
            baseURL: 'http://localhost:9001/api',
            url,
            method,
            data,
        });

        dispatch(success({ data: response.data }));
        if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        dispatch(fail({ error: errorMessage }));

        if (onError) dispatch({ type: onError, payload: errorMessage });
    }
};

export default api;
