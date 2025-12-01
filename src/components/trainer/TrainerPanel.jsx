import React, { useEffect } from 'react'
import GymSection from './GymSection'
import StudentTable from '../tables/StudentTable'
import { useDispatch } from 'react-redux'
import { fetchGymById } from '../../redux/gymSlice'
import PanelCards from './PanelCards'

const TrainerPanel = ({ gymId }) => {
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
    </div>
  )
}

export default TrainerPanel