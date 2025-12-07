import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

import { fetchStudentById } from '../../redux/studentSlice';

import PaymentSection from './components/PaymentSection'
import StudentSection from './components/StudentSection';
import RegistrationFormsSection from './components/RegistrationFormsSection';

const StudentPanel = ({ id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
  }, [dispatch, id]);

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