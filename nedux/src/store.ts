export default function create_store(reducer: Function) {
    let state: any;
    let listeners: Function[] = [];

    function dispatch(action: any) {
        state = reducer(state, action);

        for (let listener of listeners) {
            listener();
        }
    }

    function get_state() {
        return state;
    }

    function subscribe(listener: Function) {
        listeners.push(listener);
    }

    return {
        get_state,
        dispatch,
        subscribe
    };
}
