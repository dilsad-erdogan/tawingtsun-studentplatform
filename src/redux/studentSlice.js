import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent } from "../firebase/students";

// Pull all trainer
export const fetchAllStudents = createAsyncThunk(
  "trainer/fetchAllStudents",
  async () => {
    const allUsers = await getAllStudent();

    const serializedUsers = allUsers.map(user => ({
      ...user,
      date: user.date?.toDate ? user.date.toDate().toISOString() : user.date
    }));

    return serializedUsers;
  }
); //kullanıyorum

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;