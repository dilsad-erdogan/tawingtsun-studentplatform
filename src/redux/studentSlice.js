import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent, getStudentById, updateStudent as updateStudentAPI, addPaymentPlan as addPaymentPlanAPI, updateStudentPayment as updateStudentPaymentAPI, deleteStudentPayment as deleteStudentPaymentAPI, checkStudentStatus } from "../firebase/students";

export const fetchAllStudents = createAsyncThunk(
  "student/fetchAllStudents",
  async () => {
    const allUsers = await getAllStudent();
    const checkedStudents = await checkStudentStatus(allUsers);

    const serializedUsers = checkedStudents.map(user => ({
      ...user,
      date: user.date?.toDate ? user.date.toDate().toISOString() : user.date
    }));

    return serializedUsers;
  }
);

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
);

export const updateStudent = createAsyncThunk(
  "student/updateStudent",
  async ({ studentId, updatedData }) => {
    const success = await updateStudentAPI(studentId, updatedData);
    if (success) {
      return { id: studentId, ...updatedData };
    }
    throw new Error("Update failed");
  }
);

export const addPaymentPlan = createAsyncThunk(
  "student/addPaymentPlan",
  async ({ studentId, totalAmount, installmentCount }, { dispatch }) => {
    const success = await addPaymentPlanAPI(studentId, totalAmount, installmentCount);
    if (success) {
      dispatch(fetchStudentById(studentId));
    }
    return success;
  }
);

export const updateStudentPayment = createAsyncThunk(
  "student/updateStudentPayment",
  async ({ studentId, paymentId, updates }, { dispatch }) => {
    const success = await updateStudentPaymentAPI(studentId, paymentId, updates);
    if (success) {
      dispatch(fetchStudentById(studentId));
    }
    return success;
  }
);

export const deleteStudentPayment = createAsyncThunk(
  "student/deleteStudentPayment",
  async ({ studentId, paymentId }, { dispatch }) => {
    const success = await deleteStudentPaymentAPI(studentId, paymentId);
    if (success) {
      dispatch(fetchStudentById(studentId));
    }
    return success;
  }
);

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
      // fetchAllStudents
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

      // fetchStudentById
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
        // Update the specific student in the students array if needed
        if (action.payload) {
          const index = state.students.findIndex(s => s.id === action.payload.id);
          if (index !== -1) {
            state.students[index] = { ...state.students[index], ...action.payload };
          }
        }
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateStudent
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

      // addPaymentPlan
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

      // updateStudentPayment
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
      })

      // deleteStudentPayment
      .addCase(deleteStudentPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteStudentPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;