import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import companyReducer from "../Features/CompanySlice";
import jobReducer from "../Features/JobSlice";
import applicationReducer from "../Features/ApplicationSlice";
const store = configureStore({
  reducer: {
    applications: applicationReducer,
    users: usersReducer,
    companies: companyReducer,
    jobs: jobReducer,
  },
});

export default store;
