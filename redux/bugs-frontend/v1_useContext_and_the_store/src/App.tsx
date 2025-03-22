import React from 'react';
import './App.css';
import Bugs from "./components/Bugs";
import configure_store from "./store";
import StoreContext from "./contexts/storeContext";

const store = configure_store();

const App = () => {
  return (
      <StoreContext.Provider value={store}>
          <Bugs />
      </StoreContext.Provider>
  );
}

export default App;
