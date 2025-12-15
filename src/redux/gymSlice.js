import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGyms, getGymById } from "../firebase/gyms";

// ✔ Tüm salonları çek
export const fetchAllGyms = createAsyncThunk(
  "gym/fetchAllGyms",
  async (_, { getState }) => {
    const { gyms } = getState().gym;
    if (gyms && gyms.length > 0) {
      return gyms;
    }
    return await getAllGyms();
  }
); //kullanıyorum

// ✔ Tek bir salonu çek
export const fetchGymById = createAsyncThunk(
  "gym/fetchGymById",
  async (gymId, { getState }) => {
    const { gyms } = getState().gym;
    const existingGym = gyms.find(g => g.id === gymId);
    if (existingGym) {
      return existingGym;
    }
    return await getGymById(gymId);
  }
); //kullanıyorum

const gymSlice = createSlice({
  name: "gym",
  initialState: {
    gyms: [],     // tüm salonlar
    gym: null,    // tek salon (login olan kullanıcıya ait)
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ------- ▼ Tüm salonlar ▼ -------
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
      })

      // ------- ▼ Tek salon ▼ -------
      .addCase(fetchGymById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGymById.fulfilled, (state, action) => {
        state.loading = false;
        state.gym = action.payload;
      })
      .addCase(fetchGymById.rejected, (state, action) => {
        state.loading = false;
        state.gym = null;
        state.error = action.error.message;
      });
  },
});

export default gymSlice.reducer;