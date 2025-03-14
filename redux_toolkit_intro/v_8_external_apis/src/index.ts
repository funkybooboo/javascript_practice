import configure_store from "./store";
import {, selectUnresolvedBugs, loadBugs, addBug, resolveBug} from "./store/entities/bugs";
import { projects, selectUncompleteProjects } from "./store/entities/projects";

const store = configure_store();

store.dispatch(loadBugs());

const state = store.getState();
console.log(state);

setTimeout(() => store.dispatch(resolveBug(2)), 2000);
