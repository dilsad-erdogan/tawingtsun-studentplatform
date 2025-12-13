import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchAllStudents } from "../redux/studentSlice";
import Navbar from "../components/Navbar";
import GymPanel from "../components/gym/GymPanel";

const Trainer = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position='top-right' />

      <Navbar />
      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <GymPanel gymId={user?.gymId} />
        </div>
      </div>
    </div>
  )
}

export default Trainer;