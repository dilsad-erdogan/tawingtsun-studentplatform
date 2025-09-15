import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import StudentPanel from "../components/student/StudentPanel";

const Student = () => {
  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position='top-right' />
      
      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <StudentPanel />
    </div>
  )
}

export default Student