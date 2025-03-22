import create_store from "./store";
import {bugs, getUnresolvedBugs} from "./store/entities/bugs";
import {projects, getUncompleteProjects} from "./store/entities/projects";

const store = create_store();

const unsubscribe = store.subscribe(() => {
    console.log("subscribe");
});

// store.dispatch(projects.add({ name: "code" }));
//
// store.dispatch(projects.update({ id: 1, status: "doing" }));
//
// store.dispatch(projects.update({ id: 1, status: "done" }));
//
// store.dispatch(projects.remove({ id: 1 }));
//
// store.dispatch(projects.add({ name: "more code" }));
//
// store.dispatch(bugs.add({ project_id: 2, description: "Hey Kelsey!" }));
//
// store.dispatch(bugs.resolve({ id: 1 }));
//
// store.dispatch(bugs.remove({ id: 1 }));
//
// store.dispatch(bugs.add({ project_id: 2, description: "Key Helsey!" }));
//
// unsubscribe();
//
// store.dispatch(projects.add({ name: "even more code" }));
//
// store.dispatch(bugs.add({ project_id: 3,  description: "Hey Welsey!" }));

console.log(getUnresolvedBugs(store.getState()));
console.log();
console.log(getUncompleteProjects(store.getState()));
