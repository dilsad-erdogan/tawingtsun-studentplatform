import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { login } from "../firebase/login";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByUID } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const Login = () => {
  const { data } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0); // brute-force koruması

  const handleSubmit = async (e) => {
    e.preventDefault();

    // E-posta ve parola geçerlilik kontrolü (istemci tarafı)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Geçerli bir e-posta adresi giriniz.");
      return;
    }

    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı.");
      return;
    }

    if (attempts >= 5) {
      toast.error("Çok fazla deneme yaptınız. 1 dakika bekleyin.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      if (user) {
        // Firebase oturumu zaten güvenli, ama ekstra kontrol:
        const token = await auth.currentUser.getIdToken(/* forceRefresh */ true);
        sessionStorage.setItem("token", token); // Local değil, sessionStorage kullan
        dispatch(fetchUserByUID(user.uid));
        toast.success("Giriş başarılı!");
      } else {
        toast.error("Kullanıcı bulunamadı.");
      }
    } catch (err) {
      console.error(err);
      setAttempts((prev) => prev + 1);
      toast.error("Giriş başarısız. E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      navigate(`/${data.role}/${data.uid}`);
    }
  }, [data]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="font-bold text-3xl text-red-600 text-center mb-6" style={{ fontFamily: "'Lucida Handwriting', cursive" }}>
          Login
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-red-50 border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-red-50 border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400" />
          <button type="submit" disabled={loading || !email || !password} className={`${ loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700" } text-white py-2 rounded-md transition`}>
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