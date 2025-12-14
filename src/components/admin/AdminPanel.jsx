import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import GymsTable from './components/gymsTable'
import PanelCards from './components/panelCards'
import GymComparison from './components/gymComparison'
import ReportModal from './modals/ReportModal'
import { fetchAllStudents } from '../../redux/studentSlice'

const AdminPanel = () => {
  const dispatch = useDispatch()
  const [isReportOpen, setIsReportOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllStudents())
  }, [dispatch])

  return (
    <div className="mt-10 p-4 flex flex-col gap-5">
      <div className="flex justify-end">
        <button
          onClick={() => setIsReportOpen(true)}
          className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Rapor Al
        </button>
      </div>

      <PanelCards />

      <div className="mt-10">
        <GymsTable />
        <GymComparison />
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  )
}

export default AdminPanel