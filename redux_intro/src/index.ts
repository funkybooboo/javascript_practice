import store from "./store";
import {add_bug, remove_bug, resolve_bug} from "./action_creators";

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(add_bug("Hey Kelsey!"));

store.dispatch(resolve_bug(1));

store.dispatch(remove_bug(1));

store.dispatch(add_bug("Key Helsey!"));

unsubscribe();

store.dispatch(add_bug("Hey Kel"));
