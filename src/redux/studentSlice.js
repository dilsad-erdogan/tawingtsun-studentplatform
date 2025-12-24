import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStudent, getStudentsByGymId, getStudentById, updateStudent as updateStudentAPI, addNewStudent as addNewStudentAPI, addPaymentPlan as addPaymentPlanAPI, updateStudentPayment as updateStudentPaymentAPI, deleteStudentPayment as deleteStudentPaymentAPI, checkStudentStatus, transferStudents as transferStudentsAPI } from "../firebase/students";

// Cache Helpers
const CACHE_PREFIX = "student_cache_";
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

const loadFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Expiry Check
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    console.error("Cache load error", e);
    return null;
  }
};

const saveToCache = (key, data) => {
  try {
    const cachePayload = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(cachePayload));
  } catch (e) {
    console.error("Cache save error", e);
  }
};

export const fetchAllStudents = createAsyncThunk(
  "student/fetchAllStudents",
  async (gymId = null, { getState }) => {
    // 1. Try LocalStorage Cache first
    const cacheKey = CACHE_PREFIX + (gymId || "all");
    let allUsers = loadFromCache(cacheKey);

    // 2. If no cache, Fetch from Firebase
    if (!allUsers) {
      if (gymId) {
        allUsers = await getStudentsByGymId(gymId);
      } else {
        allUsers = await getAllStudent();
      }
    }

    // 3. Status Check (Always run this to ensure data integrity, even on cached data)
    // Note: checkStudentStatus does NOT consume reads, only writes if changes needed.
    const checkedStudents = await checkStudentStatus(allUsers);

    const serializedUsers = checkedStudents.map(user => ({
      ...user,
      date: user.date?.toDate ? user.date.toDate().toISOString() : user.date
    }));

    // 4. Update Cache with fresh/checked data
    saveToCache(cacheKey, serializedUsers);

    return { students: serializedUsers, cacheKey };
  }
);

export const addNewStudent = createAsyncThunk(
  "student/addNewStudent",
  async (studentData) => {
    const newStudent = await addNewStudentAPI(studentData);
    return {
      ...newStudent,
      date: newStudent.date?.toDate ? newStudent.date.toDate().toISOString() : newStudent.date
    };
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
    currentCacheKey: null,
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
        state.students = action.payload.students;
        state.currentCacheKey = action.payload.cacheKey;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addNewStudent
      .addCase(addNewStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload); // Add new student to local state
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
      })
      .addCase(addNewStudent.rejected, (state, action) => {
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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
        if (state.currentCacheKey) saveToCache(state.currentCacheKey, state.students);
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