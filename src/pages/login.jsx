import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import { login } from "../firebase/login";
import { useDispatch } from "react-redux";
import { fetchUserByUID } from "../redux/userSlice";
import { auth } from "../firebase/firebase";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (attempts >= 5) {
      toast.error("Çok fazla deneme yaptınız. 1 dakika bekleyin.");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email.trim(), password); // Firebase auth login

      if (user) {
        const authId = user.uid;

        // Token sakla
        const token = await auth.currentUser.getIdToken(true);
        sessionStorage.setItem("token", token);

        // Accounts tablosundaki kullanıcıyı çek
        dispatch(fetchUserByUID(authId));

        toast.success("Giriş başarılı!");
      }
    } catch (err) {
      setAttempts((prev) => prev + 1);
      toast.error("Email veya şifre hatalı.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="font-bold text-3xl text-red-600 text-center mb-6" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>
          Login
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-red-50 border border-gray-300 rounded-md px-4 py-2 text-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-red-50 border border-gray-300 rounded-md px-4 py-2 text-lg" />

          <button type="submit" disabled={loading || !email || !password} className={`${loading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"} text-white py-2 rounded-md transition`}>
            {loading ? "Giriş yapılıyor..." : "Log in"}
          </button>
        </form>

        {attempts > 0 && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Deneme: {attempts}/5
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;