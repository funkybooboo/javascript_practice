import configure_store from "./store/configure_store";
import bugs from "./store/entities/bugs";
import projects from "./store/entities/projects";

const store = configure_store();

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(bugs.actions.add({ description: "Hey Kelsey!" }));

store.dispatch(bugs.actions.resolve({ id: 1 }));

store.dispatch(bugs.actions.remove({ id: 1 }));

store.dispatch(bugs.actions.add({ description: "Key Helsey!" }));

store.dispatch(projects.actions.add({ name: "code" }));

store.dispatch(projects.actions.update({ id: 1, status: "doing" }));

store.dispatch(projects.actions.update({ id: 1, status: "done" }));

store.dispatch(projects.actions.remove({ id: 1 }));

store.dispatch(projects.actions.add({ name: "more code" }));

unsubscribe();

store.dispatch(bugs.actions.add({ description: "Hey Kel" }));

store.dispatch(projects.actions.add({ name: "even more code" }));
