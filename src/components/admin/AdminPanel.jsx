import React from 'react'
import UsersTable from '../tables/UsersTable'
import TrainerTable from '../tables/TrainerTable'
import GymsTable from '../tables/GymsTable'

const AdminPanel = () => {
  return (
    <div className="mt-10 gap-10">
        <UsersTable />
        <TrainerTable />
        <GymsTable />
    </div>
  )
}

export default AdminPanel