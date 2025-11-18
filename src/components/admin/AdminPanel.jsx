import GymsTable from '../tables/GymsTable'
import PanelCards from './PanelCards'

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