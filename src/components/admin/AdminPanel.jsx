import { useState } from 'react'
import GymsTable from './components/GymsTable'
import PanelCards from './components/PanelCards'
import GymComparison from './components/GymComparison'
import ReportModal from './modals/ReportModal'

const AdminPanel = () => {
  const [isReportOpen, setIsReportOpen] = useState(false)

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