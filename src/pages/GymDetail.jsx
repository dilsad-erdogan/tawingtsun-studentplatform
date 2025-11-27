import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAllStudents } from "../redux/studentSlice";

import Navbar from "../components/Navbar";
import TrainerPanel from "../components/trainer/TrainerPanel";

const GymDetail = () => {
    const { gymId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllStudents());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100 gap-5 pt-5">
            <Toaster position="top-right" />

            <Navbar />
            <div className="m-2">
                <TrainerPanel gymId={gymId} />
            </div>
        </div>
    );
};

export default GymDetail;