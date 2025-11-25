import { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const GymDetail = () => {
    const { gymId } = useParams();

    return (
        <div className="min-h-screen bg-gray-100 gap-5 pt-5">
            <Toaster position="top-right" />

            <Navbar />
            <div className="m-2">
                <h1 className="text-2xl font-bold">Salon Detayı</h1>
                <p>Salon ID: {gymId}</p>
            </div>
        </div>
    );
};

export default GymDetail;