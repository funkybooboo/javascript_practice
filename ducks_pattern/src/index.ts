import configure_store from "./store/configure_store";
import { add_bug, remove_bug, resolve_bug } from "./store/bugs";

const store = configure_store();

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(add_bug("Hey Kelsey!"));

store.dispatch(resolve_bug(1));

store.dispatch(remove_bug(1));

store.dispatch(add_bug("Key Helsey!"));

unsubscribe();

store.dispatch(add_bug("Hey Kel"));
