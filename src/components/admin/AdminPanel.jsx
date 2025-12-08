import GymsTable from './components/GymsTable'
import PanelCards from './components/PanelCards'
import GymComparison from './components/GymComparison'

const AdminPanel = () => {
  return (
    <div className="mt-10 p-4 flex flex-col gap-5">
      <PanelCards />

      <div className="mt-10">
        <GymsTable />
        <GymComparison />
      </div>
    </div>
  )
}

export default AdminPanel