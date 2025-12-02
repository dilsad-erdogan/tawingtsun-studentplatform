import React, { useEffect } from 'react'
import GymSection from './components/GymSection'
import StudentTable from './components/StudentTable'
import { useDispatch } from 'react-redux'
import { fetchGymById } from '../../redux/gymSlice'
import PanelCards from './components/PanelCards'
import PaymentSection from './components/PaymentSection'
import MonthlySection from './components/MonthlySection'

const GymPanel = ({ gymId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (gymId) {
      dispatch(fetchGymById(gymId));
    }
  }, [dispatch, gymId]);

  return (
    <div className="mt-10 gap-10">
      <div className='p-4 flex flex-col gap-5'>
        <GymSection />
        <PanelCards gymId={gymId} />
      </div>

      <StudentTable gymId={gymId} />
      <PaymentSection />
      <MonthlySection />
    </div>
  )
}

export default GymPanel