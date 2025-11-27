import React from 'react'
import GymSection from '../sections/trainer/GymSection'
import StudentSection from '../sections/trainer/StudentSection'

const TrainerPanel = ({gymId}) => {
  return (
    <div className="mt-10 gap-10">
      <GymSection gymId={gymId} />
      <StudentSection gymId={gymId} />
    </div>
  )
}

export default TrainerPanel