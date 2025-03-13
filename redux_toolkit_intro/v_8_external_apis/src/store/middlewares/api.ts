import axios from "axios";
import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../";
import * as actions from "../api";

// Define the type for the action parameter in the middleware
const api: Middleware<{}, RootState> = (store) => (next) => async (action: any) => {
    if (action.type !== actions.apiRequest.type) {
        return next(action);
    }

    next(action);

    // Extract necessary payload from action
    const { url, method, data, onSuccess, onError } = action.payload;

    try {
        const response = await axios.request({
            baseURL: 'http://localhost:9001/api',
            url,
            method,
            data,
        });

        store.dispatch(actions.apiSuccess({ data: response.data }));
        if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
        store.dispatch(actions.apiFail({ error }));
        if (onError) store.dispatch({ type: onError, payload: error });
    }
};

export default api;
