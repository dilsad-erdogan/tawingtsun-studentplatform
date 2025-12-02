import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gymReducer from "./gymSlice";
import studentReducer from "./studentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    gym: gymReducer,
    student: studentReducer
  },
});