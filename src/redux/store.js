import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gymReducer from "./gymSlice";
import trainerReducer from "./trainerSlice";
import studentReducer from "./studentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    gym: gymReducer,
    trainer: trainerReducer,
    student: studentReducer
  },
});