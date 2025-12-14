import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import toast from "react-hot-toast";

export const getAllStudent = async () => {
  try {
    const studentsRef = collection(firestore, "students");
    const querySnapshot = await getDocs(studentsRef);

    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return students;
  } catch (error) {
    console.error("getAllStudent error:", error);
    toast.error("Öğrencilerin çekilmesi sırasında hata oluştu.");
    return [];
  }
}; //kullanıyorum

export const addNewStudent = async (data) => {
  try {
    const studentsRef = collection(firestore, "students");

    const newStudent = {
      name: data.name,
      phone: data.phone,
      group: data.group,
      level: data.level,
      studyPeriod: data.studyPeriod,
      gymId: data.gymId,
      isActive: true,
      date: new Date().toISOString(),
      registrationForms: []
    };

    const docRef = await addDoc(studentsRef, newStudent);
    return { id: docRef.id, ...newStudent };

  } catch (error) {
    console.error("addNewStudent error:", error);
    throw error;
  }
}; //kullanıyorum

export const getActiveStudentsCountByGymId = async (gymId) => {
  try {
    const studentsRef = collection(firestore, "students");
    const q = query(
      studentsRef,
      where("gymId", "==", gymId),
      where("isActive", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("getActiveStudentsCountByGymId error:", error);
    return 0;
  }
}; //kullanıyorum

export const getStudentById = async (id) => {
  try {
    const ref = doc(firestore, "students", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };

  } catch (error) {
    console.error("getStudentById Error:", error);
    throw error;
  }
};//kullandım

export const updateStudent = async (id, updatedData) => {
  try {
    const studentRef = doc(firestore, "students", id);
    await updateDoc(studentRef, updatedData);
    toast.success("Öğrenci başarıyla güncellendi!");
    return true;
  } catch (error) {
    console.error("updateStudent error:", error);
    toast.error("Öğrenci güncellenemedi");
    return false;
  }
};//kullandım

export const addPaymentPlan = async (studentId, totalAmount, installmentCount) => {
  try {
    const studentRef = doc(firestore, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      toast.error("Öğrenci bulunamadı!");
      return false;
    }

    const currentPayments = studentSnap.data().payments || [];
    const newPayments = [];
    const monthlyAmount = Math.floor(totalAmount / installmentCount);
    const today = new Date();

    for (let i = 0; i < installmentCount; i++) {
      const paymentDate = new Date(today);
      paymentDate.setMonth(today.getMonth() + i);

      newPayments.push({
        id: crypto.randomUUID(),
        date: paymentDate.toISOString(),
        amount: monthlyAmount,
        description: `Taksit ${i + 1}/${installmentCount}`,
        status: "pending", // pending, paid
        paidDate: null
      });
    }

    const updatedPayments = [...currentPayments, ...newPayments];

    await updateDoc(studentRef, { payments: updatedPayments });
    toast.success("Ödeme planı oluşturuldu!");
    return true;

  } catch (error) {
    console.error("addPaymentPlan error:", error);
    toast.error("Ödeme planı oluşturulurken hata oluştu.");
    return false;
  }
};//kullandım

export const updateStudentPayment = async (studentId, paymentId, updates) => {
  try {
    const studentRef = doc(firestore, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      toast.error("Öğrenci bulunamadı!");
      return false;
    }

    const currentPayments = studentSnap.data().payments || [];
    const paymentIndex = currentPayments.findIndex(p => p.id === paymentId);

    if (paymentIndex === -1) {
      toast.error("Ödeme kaydı bulunamadı!");
      return false;
    }

    // Update the specific payment
    currentPayments[paymentIndex] = {
      ...currentPayments[paymentIndex],
      ...updates
    };

    await updateDoc(studentRef, { payments: currentPayments });
    toast.success("Ödeme bilgisi güncellendi!");
    return true;

  } catch (error) {
    console.error("updateStudentPayment error:", error);
    toast.error("Ödeme güncellenirken hata oluştu.");
    return false;
  }
};//kullandım

export const deleteStudentPayment = async (studentId, paymentId) => {
  try {
    const studentRef = doc(firestore, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      toast.error("Öğrenci bulunamadı!");
      return false;
    }

    const currentPayments = studentSnap.data().payments || [];
    const updatedPayments = currentPayments.filter(p => p.id !== paymentId);

    await updateDoc(studentRef, { payments: updatedPayments });
    toast.success("Ödeme başarıyla silindi!");
    return true;

  } catch (error) {
    console.error("deleteStudentPayment error:", error);
    toast.error("Ödeme silinirken hata oluştu.");
    return false;
  }
};//kullandım

export const checkStudentStatus = async (students) => {
  try {
    const today = new Date();
    const updatedStudents = await Promise.all(students.map(async (student) => {
      if (!student.isActive || !student.date || !student.studyPeriod) {
        return student;
      }

      const registrationDate = new Date(student.date);
      const studyPeriodMonths = parseInt(student.studyPeriod);

      if (isNaN(studyPeriodMonths)) return student;

      const expirationDate = new Date(registrationDate);
      expirationDate.setMonth(expirationDate.getMonth() + studyPeriodMonths);

      if (today > expirationDate) {
        // Student is expired, update status
        await updateStudent(student.id, { isActive: false });
        return { ...student, isActive: false };
      }

      return student;
    }));

    return updatedStudents;
  } catch (error) {
    console.error("checkStudentStatus error:", error);
    return students; // Return original list in case of error
  }
};//kullandım

export const deleteStudent = async (studentId) => {
  try {
    const studentRef = doc(firestore, "students", studentId);
    await deleteDoc(studentRef);
    toast.success("Öğrenci başarıyla silindi!");
    return true;
  } catch (error) {
    console.error("deleteStudent error:", error);
    toast.error("Öğrenci silinirken hata oluştu.");
    return false;
  }
};//kullandım