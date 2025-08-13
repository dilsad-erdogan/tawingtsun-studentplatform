import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByUID } from "../firebase/users";

export const fetchUserByUID = createAsyncThunk(
  "user/fetchUserByUID",
  async (uid) => {
    const userData = await getUserByUID(uid);
    return userData;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByUID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUID.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserByUID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;