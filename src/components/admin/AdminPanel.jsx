import React from 'react'
import UsersTable from '../tables/UsersTable'
import TrainerTable from '../tables/TrainerTable'
import GymsTable from '../tables/GymsTable'
import PanelCards from './PanelCards'

const AdminPanel = () => {
  return (
    <div className="mt-10 space-y-10 px-4 sm:px-8">
      <PanelCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <UsersTable />
        <TrainerTable />
      </div>

      <div className="w-full">
        <GymsTable />
      </div>
    </div>
  )
}

export default AdminPanel