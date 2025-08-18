import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByUID, getAllUsers } from "../firebase/users";

// Single user capture
export const fetchUserByUID = createAsyncThunk(
  "user/fetchUserByUID",
  async (uid) => {
    const userData = await getUserByUID(uid);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData.name));
    }

    return userData;
  }
);

// Pull all users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async () => {
    const allUsers = await getAllUsers();
    return allUsers;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: JSON.parse(localStorage.getItem("user")) || null, // Single user
    users: [], // All users
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.data = null;
    },
    clearUsers: (state) => {
      state.users = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Single user
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
      })

      // All users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;