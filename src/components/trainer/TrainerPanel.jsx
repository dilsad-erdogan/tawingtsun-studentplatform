import React from 'react'
import GymSection from '../sections/GymSection'
import StudentSection from '../sections/StudentSection'

const TrainerPanel = () => {
  return (
    <div className="mt-10 gap-10">
      <GymSection />
      <StudentSection />
    </div>
  )
}

export default TrainerPanel