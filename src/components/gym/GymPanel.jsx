import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { fetchGymById } from '../../redux/gymSlice'
import { fetchAllStudents } from '../../redux/studentSlice'

import GymSection from './components/GymSection'
import StudentTable from './components/StudentTable'
import PanelCards from './components/PanelCards'
import PaymentSection from './components/PaymentSection'
import MonthlySection from './components/MonthlySection'
import GymReportModal from './modals/GymReportModal'

const GymPanel = ({ gymId }) => {
  const dispatch = useDispatch();

  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (gymId) {
      dispatch(fetchGymById(gymId));
      dispatch(fetchAllStudents());
    }
  }, [dispatch, gymId]);

  return (
    <div className="mt-10 gap-10">
      <div className='p-4 flex flex-col gap-5'>
        <div className="flex justify-end">
          <button
            onClick={() => setIsReportOpen(true)}
            className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition shadow-sm"
          >
            Rapor Al
          </button>
        </div>
        <GymSection />
        <PanelCards gymId={gymId} />
      </div>

      <StudentTable gymId={gymId} />
      <PaymentSection gymId={gymId} />
      <MonthlySection />

      <GymReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        gymId={gymId}
      />
    </div>
  )
}

export default GymPanel