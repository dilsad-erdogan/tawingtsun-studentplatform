import React from 'react'
import InfoSection from '../sections/student/InfoSection'
import PaymentsSection from '../sections/student/PaymentsSection'

const StudentPanel = () => {
  return (
    <div className="mt-10 gap-10">
      <InfoSection />
      <PaymentsSection />
    </div>
  )
}

export default StudentPanel