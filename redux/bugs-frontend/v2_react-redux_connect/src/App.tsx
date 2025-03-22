import React from 'react';
import './App.css';
import Bugs from "./components/Bugs";
import configure_store from "./store";
import {Provider} from "react-redux";

const store = configure_store();

const App = () => {
  return (
      <Provider store={store}>
          <Bugs />
      </Provider>
  );
}

export default App;
