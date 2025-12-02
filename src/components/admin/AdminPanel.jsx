import GymsTable from './components/GymsTable'
import PanelCards from './components/PanelCards'

const AdminPanel = () => {
  return (
    <div className="mt-10">
      <PanelCards />

      <div className="mt-10">
        <GymsTable />
      </div>
    </div>
  )
}

export default AdminPanel