import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gymReducer from "./gymSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    gym: gymReducer,
  },
});