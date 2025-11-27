import React from 'react'
import GymSection from './GymSection'
import StudentTable from '../tables/StudentTable'

const TrainerPanel = ({ gymId }) => {
  return (
    <div className="mt-10 gap-10">
      <GymSection gymId={gymId} />
      <StudentTable gymId={gymId} />
    </div>
  )
}

export default TrainerPanel