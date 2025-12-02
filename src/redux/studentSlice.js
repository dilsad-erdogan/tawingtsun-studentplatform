import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent, getStudentById } from "../firebase/students";

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

export const fetchStudentById = createAsyncThunk(
  "student/fetchStudentById",
  async (studentId) => {
    const student = await getStudentById(studentId);
    if (student) {
      return {
        ...student,
        date: student.date?.toDate ? student.date.toDate().toISOString() : student.date
      };
    }
    return null;
  }
);  //kullanıyorum

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    student: null,
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
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default studentSlice.reducer;