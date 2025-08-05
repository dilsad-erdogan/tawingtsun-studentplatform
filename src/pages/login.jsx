import { useState } from "react";
import { Toaster } from 'react-hot-toast';
//import { useNavigate } from "react-router-dom";

const Login = () => {
    //const navigate = useNavigate();
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        //const user = await login(email, password);
        // if(user) {
        //     navigate('/main');
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster position="top-right" />
            
            {/* Login Card */}
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="font-bold text-3xl text-red-600 text-center mb-6" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>
                    Login
                </h1>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-red-100 border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-red-100 border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
                    <button type="submit" disabled={!email || !password} className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:bg-red-300">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
