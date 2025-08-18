import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGyms } from "../firebase/gyms";

// Pull all gyms
export const fetchAllGyms = createAsyncThunk(
  "gym/fetchAllGyms",
  async () => {
    const allUsers = await getAllGyms();
    return allUsers;
  }
);

const gymSlice = createSlice({
  name: "gym",
  initialState: {
    gyms: [], // All gyms
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // All users
      .addCase(fetchAllGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms = action.payload;
      })
      .addCase(fetchAllGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gymSlice.reducer;