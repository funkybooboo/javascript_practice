import { combineReducers } from "redux";

import user_reducer from "./users";

export default combineReducers({
    users: user_reducer,
});
