import React from 'react';
import './App.css';
import BugsList from "./components/BugsList";
import configure_store from "./store";
import {Provider} from "react-redux";

const store = configure_store();

const App = () => {
  return (
      <Provider store={store}>
          <BugsList />
      </Provider>
  );
}

export default App;
