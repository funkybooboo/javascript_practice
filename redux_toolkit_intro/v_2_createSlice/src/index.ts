import configure_store from "./store/configure_store";
import bugs_slice from "./store/bugs";

const store = configure_store();

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(bugs_slice.actions.add({ description: "Hey Kelsey!" }));

store.dispatch(bugs_slice.actions.resolve({ id: 1 }));

store.dispatch(bugs_slice.actions.remove({ id: 1 }));

store.dispatch(bugs_slice.actions.add({ description: "Key Helsey!" }));

unsubscribe();

store.dispatch(bugs_slice.actions.add({ description: "Hey Kel" }));
