import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent, getStudentById, updateStudent as updateStudentAPI, addPaymentPlan as addPaymentPlanAPI, updateStudentPayment as updateStudentPaymentAPI } from "../firebase/students";

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

export const updateStudent = createAsyncThunk(
  "student/updateStudent",
  async ({ studentId, updatedData }) => {
    const updatedStudent = await updateStudentAPI(studentId, updatedData);
    return updatedStudent;
  }
); //kullanıyorum

export const addPaymentPlan = createAsyncThunk(
  "student/addPaymentPlan",
  async ({ studentId, totalAmount, installmentCount }, { dispatch }) => {
    const success = await addPaymentPlanAPI(studentId, totalAmount, installmentCount);
    if (success) {
      dispatch(fetchStudentById(studentId)); // Refresh student data to get new payments
    }
    return success;
  }
); //kullanıyorum

export const updateStudentPayment = createAsyncThunk(
  "student/updateStudentPayment",
  async ({ studentId, paymentId, updates }, { dispatch }) => {
    const success = await updateStudentPaymentAPI(studentId, paymentId, updates);
    if (success) {
      dispatch(fetchStudentById(studentId));
    }
    return success;
  }
); //kullanıyorum

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
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific student in the students array if needed
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...action.payload };
        }
        // Update the currently selected student if it matches
        if (state.student && state.student.id === action.payload.id) {
          state.student = { ...state.student, ...action.payload };
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPaymentPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentPlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addPaymentPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateStudentPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStudentPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;