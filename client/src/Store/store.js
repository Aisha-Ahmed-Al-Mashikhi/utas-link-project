// import { configureStore } from "@reduxjs/toolkit";

// /* ================= REDUX PERSIST ================= */
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // localStorage
// import { combineReducers } from "redux";

// /* ================= REDUCERS ================= */
// import usersReducer from "../Features/UserSlice";
// import companyReducer from "../Features/CompanySlice";
// import jobReducer from "../Features/JobSlice";
// import applicationReducer from "../Features/ApplicationSlice";
// import chatReducer from "../Features/ChatSlice";
// import postReducer from "../Features/PostSlice";

// /* ================= PERSIST CONFIG ================= */
// const persistConfig = {
//   key: "reduxstore",
//   storage,
// };

// /* ================= ROOT REDUCER ================= */
// const rootReducer = combineReducers({
//   applications: applicationReducer,
//   users: usersReducer,
//   companies: companyReducer,
//   jobs: jobReducer,
//   chat: chatReducer,
//   posts: postReducer,
// });

// /* ================= PERSISTED REDUCER ================= */
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// /* ================= STORE ================= */
// const store = configureStore({
//   reducer: persistedReducer,
// });

// /* ================= PERSISTOR ================= */
// const persistore = persistStore(store);

// /* ================= EXPORTS ================= */
// export { store, persistore };
// export default store;
import { configureStore } from "@reduxjs/toolkit";

/* ================= REDUX PERSIST ================= */
// 1. Import the internal Redux Persist action types
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";

/* ================= REDUCERS ================= */
import usersReducer from "../Features/UserSlice";
import companyReducer from "../Features/CompanySlice";
import jobReducer from "../Features/JobSlice";
import applicationReducer from "../Features/ApplicationSlice";
import chatReducer from "../Features/ChatSlice";
import postReducer from "../Features/PostSlice";

/* ================= PERSIST CONFIG ================= */
const persistConfig = {
  key: "reduxstore",
  storage,
};

/* ================= ROOT REDUCER ================= */
const rootReducer = combineReducers({
  applications: applicationReducer,
  users: usersReducer,
  companies: companyReducer,
  jobs: jobReducer,
  chat: chatReducer,
  posts: postReducer,
});

/* ================= PERSISTED REDUCER ================= */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ================= STORE ================= */
const store = configureStore({
  reducer: persistedReducer,
  // 2. Add this middleware configuration to ignore Redux Persist actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/* ================= PERSISTOR ================= */
const persistore = persistStore(store);

/* ================= EXPORTS ================= */
export { store, persistore };
export default store;