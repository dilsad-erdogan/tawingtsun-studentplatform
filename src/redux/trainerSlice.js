import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTrainer } from "../firebase/trainers";

// Pull all trainer
export const fetchAllTrainers = createAsyncThunk(
  "trainer/fetchAllTrainers",
  async () => {
    const allUsers = await getAllTrainer();
    return allUsers;
  }
);

const trainerSlice = createSlice({
  name: "trainer",
  initialState: {
    trainers: [], // All trainers
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All trainers
      .addCase(fetchAllTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchAllTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default trainerSlice.reducer;