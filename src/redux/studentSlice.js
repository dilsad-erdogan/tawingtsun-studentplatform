import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent, getStudentById, updateStudent as updateStudentAPI, addPaymentPlan as addPaymentPlanAPI, updateStudentPayment as updateStudentPaymentAPI, deleteStudentPayment as deleteStudentPaymentAPI, checkStudentStatus, transferStudents as transferStudentsAPI } from "../firebase/students";

export const fetchAllStudents = createAsyncThunk(
  "student/fetchAllStudents",
  async (_, { getState }) => {
    const { students } = getState().student;

    // Cache check: Eğer öğrenciler zaten yüklüyse tekrar çekme
    if (students && students.length > 0) {
      return students;
    }

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
  async (studentId, { getState }) => {
    const { students } = getState().student;

    // Cache check: Eğer öğrenci listede varsa oradan al
    const existingStudent = students.find(s => s.id === studentId);
    if (existingStudent) {
      return existingStudent;
    }

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
      return { id: studentId, changes: updatedData };
    }
    throw new Error("Update failed");
  }
);

export const deleteStudent = createAsyncThunk(
  "student/deleteStudent",
  async (studentId) => {
    const { deleteStudent: deleteStudentAPI } = await import("../firebase/students");
    const success = await deleteStudentAPI(studentId);
    if (success) {
      return studentId;
    }
    throw new Error("Delete failed");
  }
);

export const addPaymentPlan = createAsyncThunk(
  "student/addPaymentPlan",
  async ({ studentId, totalAmount, installmentCount, startDate }) => {
    const updatedPayments = await addPaymentPlanAPI(studentId, totalAmount, installmentCount, startDate);
    if (updatedPayments) {
      return { studentId, updatedPayments };
    }
    throw new Error("Payment plan failed");
  }
);

export const updateStudentPayment = createAsyncThunk(
  "student/updateStudentPayment",
  async ({ studentId, paymentId, updates }) => {
    const updatedPayments = await updateStudentPaymentAPI(studentId, paymentId, updates);
    if (updatedPayments) {
      return { studentId, updatedPayments };
    }
    throw new Error("Payment update failed");
  }
);

export const deleteStudentPayment = createAsyncThunk(
  "student/deleteStudentPayment",
  async ({ studentId, paymentId }) => {
    const updatedPayments = await deleteStudentPaymentAPI(studentId, paymentId);
    if (updatedPayments) {
      return { studentId, updatedPayments };
    }
    throw new Error("Payment delete failed");
  }
);

export const transferStudents = createAsyncThunk(
  "student/transferStudents",
  async ({ studentIds, targetGymId }) => {
    const success = await transferStudentsAPI(studentIds, targetGymId);
    if (success) {
      return { studentIds, targetGymId };
    }
    throw new Error("Transfer failed");
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
        // Update local state
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...action.payload.changes };
        }
        if (state.student && state.student.id === action.payload.id) {
          state.student = { ...state.student, ...action.payload.changes };
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
      .addCase(addPaymentPlan.fulfilled, (state, action) => {
        state.loading = false;
        const { studentId, updatedPayments } = action.payload;

        // Update list
        const listIndex = state.students.findIndex(s => s.id === studentId);
        if (listIndex !== -1) {
          state.students[listIndex].payments = updatedPayments;
        }

        // Update single view
        if (state.student && state.student.id === studentId) {
          state.student.payments = updatedPayments;
        }
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
      .addCase(updateStudentPayment.fulfilled, (state, action) => {
        state.loading = false;
        const { studentId, updatedPayments } = action.payload;

        const listIndex = state.students.findIndex(s => s.id === studentId);
        if (listIndex !== -1) {
          state.students[listIndex].payments = updatedPayments;
        }

        if (state.student && state.student.id === studentId) {
          state.student.payments = updatedPayments;
        }
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
      .addCase(deleteStudentPayment.fulfilled, (state, action) => {
        state.loading = false;
        const { studentId, updatedPayments } = action.payload;

        const listIndex = state.students.findIndex(s => s.id === studentId);
        if (listIndex !== -1) {
          state.students[listIndex].payments = updatedPayments;
        }

        if (state.student && state.student.id === studentId) {
          state.student.payments = updatedPayments;
        }
      })
      .addCase(deleteStudentPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // deleteStudent
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
        if (state.student && state.student.id === action.payload) {
          state.student = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // transferStudents
      .addCase(transferStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(transferStudents.fulfilled, (state, action) => {
        state.loading = false;
        const { studentIds, targetGymId } = action.payload;

        // Update gymId for transferred students in the list
        state.students = state.students.map(student => {
          if (studentIds.includes(student.id)) {
            return { ...student, gymId: targetGymId };
          }
          return student;
        });

        // Update if the currently viewed student is one of the transferred ones
        if (state.student && studentIds.includes(state.student.id)) {
          state.student = { ...state.student, gymId: targetGymId };
        }
      })
      .addCase(transferStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentSlice.reducer;