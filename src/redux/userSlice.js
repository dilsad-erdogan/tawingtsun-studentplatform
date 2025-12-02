import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByUID } from "../firebase/accounts";

// 🔹 Tek kullanıcıyı Firestore'dan UID ile getir
export const fetchUserByUID = createAsyncThunk(
  "user/fetchUserByUID",
  async (authId, thunkAPI) => {
    try {
      const account = await getUserByUID(authId);

      if (!account) {
        return thunkAPI.rejectWithValue("Bu kullanıcı Accounts tablosunda bulunamadı");
      }

      // Oturumu SessionStorage’da sakla
      sessionStorage.setItem("account", JSON.stringify(account));

      return account;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
); //kullanıyorum

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: JSON.parse(sessionStorage.getItem("account")) || null, // Tek kullanıcı
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
  },
});

export const { logout, clearUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;