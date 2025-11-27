import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import TrainerPanel from "../components/trainer/TrainerPanel";

const Trainer = () => {
  return (
    <div className="min-h-screen bg-gray-100 gap-5 pt-5">
      <Toaster position='top-right' />

      {/* Navbar */}
      <Navbar />

      {/* Contents */}
      <div className="flex flex-1">

        {/* Panel */}
        <div className="flex-1 p-6">
          <TrainerPanel />
        </div>
      </div>
    </div>
  )
}

export default Trainer