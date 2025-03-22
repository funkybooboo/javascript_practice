import { createContext } from "react";
import {Store} from "redux";

const StoreContext = createContext<Store | null>(null);

export default StoreContext;
