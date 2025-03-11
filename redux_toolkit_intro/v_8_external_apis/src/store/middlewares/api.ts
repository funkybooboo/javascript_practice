import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../index";

// const action = {
//     type: 'apiRequest',
//     payload: {
//         url: '/bugs',
//         method: 'get',
//         data: {},
//         onSuccess: 'bug_receive',
//         onError: 'api_failed',
//     }
// };

const api: Middleware<{}, RootState> = (store) => (next) => async (action) => {
    if (action.type !== 'apiRequest') {
        return next(action);
    }

    next(action);

    const {url, method, data, onSuccess, onError} = action.payload;
    try {
        const response = await axios.request({
            baseURL: 'http://localhost:9001/api',
            url,
            method,
            data,
        });
        store.dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
        store.dispatch({ type: onError, payload: error });
    }
};

export default api;
