import {createStore} from 'redux';
import {reducer} from "./bugs";

export default function configure_store() {
    return createStore(reducer);
}
