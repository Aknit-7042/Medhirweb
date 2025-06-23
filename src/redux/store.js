import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./slices/companiesSlice";
import modulesReducer from "./slices/modulesSlice";
import authReducer from "./slices/authSlice";
import sessionStorageReducer from './slices/sessionStorageSlice';

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    modules: modulesReducer,
    auth: authReducer,
    sessionStorage: sessionStorageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents serialization errors with async actions
    }),
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools in development mode
});

export default store;
