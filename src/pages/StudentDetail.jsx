import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar';
import StudentPanel from '../components/student/StudentPanel';

const StudentDetail = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position='top-right' />

            <Navbar />
            <div className="m-2">
                <StudentPanel id={id} />
            </div>
        </div>
    );
};

export default StudentDetail;
