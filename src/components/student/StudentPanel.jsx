import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

import { fetchStudentById } from '../../redux/studentSlice';

import PaymentSection from './components/PaymentSection'
import StudentSection from './components/StudentSection';
import RegistrationFormsSection from './components/RegistrationFormsSection';

const StudentPanel = ({ id }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

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
        <StudentSection />
        <PaymentSection />
        <RegistrationFormsSection />
      </div>
    </div>
  )
}

export default StudentPanel