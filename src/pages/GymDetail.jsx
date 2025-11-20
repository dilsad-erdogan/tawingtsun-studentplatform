import { useParams } from "react-router-dom";

const GymDetail = () => {
    const { gymId } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Salon Detayı</h1>
            <p>Salon ID: {gymId}</p>
        </div>
    );
};

export default GymDetail;