import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gymReducer from "./gymSlice";
import trainerReducer from "./trainerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    gym: gymReducer,
    trainer: trainerReducer
  },
});