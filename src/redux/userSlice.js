import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByUID, getAllUsers } from "../firebase/users";

// 🔹 Tek kullanıcıyı Firestore'dan UID ile getir
export const fetchUserByUID = createAsyncThunk(
  "user/fetchUserByUID",
  async (uid, thunkAPI) => {
    try {
      const userData = await getUserByUID(uid);

      if (userData) {
        // Tüm user objesini kaydedelim (sadece name değil)
        sessionStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        return thunkAPI.rejectWithValue("Kullanıcı bulunamadı");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔹 Tüm kullanıcıları getir (admin için)
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const allUsers = await getAllUsers();
      return allUsers;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: JSON.parse(sessionStorage.getItem("user")) || null, // Tek kullanıcı
    users: [], // Tüm kullanıcılar
    status: "idle", // idle | loading | succeeded | failed
    loading: false,
    error: null,
  },
  reducers: {
    // Kullanıcı çıkış yaparsa
    logout: (state) => {
      state.data = null;
      state.users = [];
      state.status = "idle";
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem("user");
    },
    clearUser: (state) => {
      state.data = null;
      sessionStorage.removeItem("user");
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Tek kullanıcı
      .addCase(fetchUserByUID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUID.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserByUID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // Tüm kullanıcılar
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { logout, clearUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;