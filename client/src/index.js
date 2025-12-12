import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistore } from "./Store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistore}>
      <App />
    </PersistGate>
  </React.StrictMode>
</Provider>
);
