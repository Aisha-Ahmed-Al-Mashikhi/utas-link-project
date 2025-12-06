import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import companyReducer from "../Features/CompanySlice";
import jobReducer from "../Features/JobSlice";
import applicationReducer from "../Features/ApplicationSlice";
import chatReducer from "../Features/ChatSlice";
import postReducer from "../Features/PostSlice";

const store = configureStore({
  reducer: {
    applications: applicationReducer,
    users: usersReducer,
    companies: companyReducer,
    jobs: jobReducer,
    chat: chatReducer,
    posts: postReducer,
  },
});

export default store;
