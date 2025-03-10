import create_store from './store';

function reducer(state: any, action: any) {
    console.log(action);
    return state;
}

const store = create_store(reducer);

console.log(store.get_state());

function listener() {
    console.log("hello from listener");
}

store.subscribe(listener);

store.dispatch('hello from reducer');

console.log(store.get_state());
