import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

import { fetchStudentById } from '../../redux/studentSlice';

import PaymentSection from './components/PaymentSection'
import StudentSection from './components/StudentSection';
import RegistrationFormsSection from './components/RegistrationFormsSection';
import StudentReportModal from './modals/StudentReportModal';

const StudentPanel = ({ id }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setIsInitializing(true);
      dispatch(fetchStudentById(id))
        .finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, [dispatch, id]);

  if (isInitializing) {
    return <div className="p-4 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="mt-10 gap-10">
      <div className='p-4 flex flex-col gap-5'>
        <div className="flex justify-end">
          <button
            onClick={() => setIsReportOpen(true)}
            className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition shadow-sm"
          >
            Rapor Al
          </button>
        </div>
        <StudentSection />
        <PaymentSection />
        <RegistrationFormsSection />
      </div>

      <StudentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        studentId={id}
      />
    </div>
  )
}

export default StudentPanel