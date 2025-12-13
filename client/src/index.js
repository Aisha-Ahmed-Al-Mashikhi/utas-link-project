// Import React core
import React from "react";
// Import React DOM client
import ReactDOM from "react-dom/client";
// Import main App component
import App from "./App";
// Import Redux Provider
import { Provider } from "react-redux";
// Import Redux Persist gate
import { PersistGate } from "redux-persist/integration/react";
// Import Redux store and persistor
import { store, persistore } from "./Store/store";

// Create React root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render application
root.render(
  // Provide Redux store
  <Provider store={store}>
    {/* Enable React strict mode */}
    <React.StrictMode>
      {/* Delay rendering until persisted state is loaded */}
      <PersistGate loading={null} persistor={persistore}>
        {/* Render main App */}
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>
);
