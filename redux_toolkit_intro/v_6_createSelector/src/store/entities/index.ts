import { combineReducers } from "redux";

import bug_reducer from "./bugs";
import project_reducer  from "./projects";

export default combineReducers({
    bugs: bug_reducer,
    projects: project_reducer,
});
