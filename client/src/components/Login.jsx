import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user);
    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center">

        <div className="mx-auto w-20 h-20 bg-[#f5f0e8] rounded-2xl flex items-center justify-center mb-6">
          <svg viewBox="0 0 80 80" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 28 Q12 20 20 20 L38 20 Q42 20 44 23 L48 28 L60 28 Q68 28 68 36 L68 58 Q68 66 60 66 L20 66 Q12 66 12 58 Z"
              stroke="#7a8c7a" strokeWidth="2.5" fill="none" strokeLinejoin="round"
            />
            <line x1="12" y1="36" x2="68" y2="36" stroke="#7a8c7a" strokeWidth="2"/>
            <circle cx="36" cy="27" r="3" stroke="#3d7a6a" strokeWidth="2" fill="none"/>
            <path d="M30 34 Q30 30 36 30 Q42 30 42 34" stroke="#3d7a6a" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="46" cy="26" r="2.5" stroke="#3d7a6a" strokeWidth="1.8" fill="none"/>
            <path d="M41 33 Q41.5 29.5 46 29.5 Q50.5 29.5 51 33" stroke="#3d7a6a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <circle cx="26" cy="26" r="2.5" stroke="#3d7a6a" strokeWidth="1.8" fill="none"/>
            <path d="M21 33 Q21.5 29.5 26 29.5 Q30.5 29.5 31 33" stroke="#3d7a6a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <rect x="18" y="42" width="13" height="10" rx="2.5" fill="#3d7a6a"/>
            <rect x="34" y="42" width="13" height="10" rx="2.5" fill="#3d7a6a"/>
            <rect x="50" y="42" width="13" height="18" rx="2.5" fill="#3d7a6a"/>
            <rect x="18" y="55" width="13" height="7" rx="2.5" fill="#3d7a6a"/>
            <rect x="34" y="55" width="13" height="7" rx="2.5" fill="#3d7a6a"/>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Laboral</h1>
        <p className="text-gray-400 text-sm mt-1 tracking-widest uppercase">Costos • Chiapas</p>

        <div className="my-10">
          <p className="text-gray-500 text-sm mb-6">Inicia sesión con tu cuenta de Google</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all py-4 rounded-2xl text-base font-medium text-gray-700 disabled:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.26-2.07 2.95v2.78h3.35c1.96-1.81 3.09-4.47 3.09-7.99z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.78c-.98.66-2.23 1.06-3.93 1.06-3.02 0-5.58-2.04-6.5-4.78H2.18v2.99C4.02 20.95 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.5 14.63c-.42-1.22-.65-2.52-.65-3.88s.23-2.66.65-3.88V3.75H2.18C1.43 5.48 1 7.2 1 9.25s.43 3.77 1.18 5.5l2.32-1.12z" fill="#FBBC05"/>
              <path d="M12 4.75c1.69 0 3.2.59 4.4 1.74l3.3-3.3C17.46 1.69 14.9 0.75 12 .75 7.7.75 4.02 3.8 2.18 7.75l2.32 1.12C5.42 6.79 8.48 4.75 12 4.75z" fill="#EA4335"/>
            </svg>
            <span>{loading ? "Conectando..." : "Continuar con Google"}</span>
          </button>

          {loading ? (
            <p className="mt-4 text-sm text-[#3d7a6a] font-medium">Verificando cuenta...</p>
          ) : null}
          {error ? (
            <p className="mt-4 text-sm text-red-400 font-medium">{error}</p>
          ) : null}
        </div>

        <p className="text-xs text-gray-300">Acceso restringido • Solo usuarios autorizados</p>
      </div>
    </div>
  );
};

export default Login;