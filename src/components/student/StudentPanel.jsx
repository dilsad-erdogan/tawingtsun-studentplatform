import React, { useEffect } from 'react'
import PaymentsSection from '../sections/student/PaymentsSection'
import StudentSection from './StudentSection';
import { useDispatch } from 'react-redux';
import { fetchStudentById } from '../../redux/studentSlice';

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
      </div>

      <PaymentsSection />
    </div>
  )
}

export default StudentPanel