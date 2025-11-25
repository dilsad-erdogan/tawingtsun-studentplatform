import React from 'react'
import GymSection from '../sections/trainer/GymSection'
import StudentSection from '../sections/trainer/StudentSection'

const TrainerPanel = ({gymId, gymName}) => {
  console.log(gymId)
  console.log(gymName)
  
  return (
    <div className="mt-10 gap-10">
      <GymSection />
      <StudentSection />
    </div>
  )
}

export default TrainerPanel