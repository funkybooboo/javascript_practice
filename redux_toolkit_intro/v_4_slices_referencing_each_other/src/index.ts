import configure_store from "./store/configure_store";
import bugs from "./store/entities/bugs";
import projects from "./store/entities/projects";

const store = configure_store();

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(projects.actions.add({ name: "code" }));

store.dispatch(projects.actions.update({ id: 1, status: "doing" }));

store.dispatch(projects.actions.update({ id: 1, status: "done" }));

store.dispatch(projects.actions.remove({ id: 1 }));

store.dispatch(projects.actions.add({ name: "more code" }));

store.dispatch(bugs.actions.add({ project_id: 2, description: "Hey Kelsey!" }));

store.dispatch(bugs.actions.resolve({ id: 1 }));

store.dispatch(bugs.actions.remove({ id: 1 }));

store.dispatch(bugs.actions.add({ project_id: 2, description: "Key Helsey!" }));

unsubscribe();

store.dispatch(projects.actions.add({ name: "even more code" }));

store.dispatch(bugs.actions.add({ project_id: 3,  description: "Hey Kel" }));
