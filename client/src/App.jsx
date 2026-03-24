import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase';
import CostosLaborales from './components/CalculadoraCostos';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  /* Detectamos si Stripe nos mando la senal de exito en la URL */;
  const urlParams = new URLSearchParams(window.location.search);
  const pagoExitoso = urlParams.get('pago') === 'exito';

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return () => desuscribir();
  }, []);

  const iniciarSesion = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
    }
  };

  const procesarPago = async () => {
    try {
      const monto = 20;
      const r = 1;

const respuesta = await fetch('https://calculadora-costos-g6vh.onrender.com/api/pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ monto: monto, r: r })
      });

      const sesion = await respuesta.json();

      /* Redireccion directa con la URL generada por tu backend */;
      if (sesion.url) {
          window.location.href = sesion.url;
      } else {
          console.error("Esto contesto el servidor:", sesion);
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      window.history.replaceState(null, '', window.location.pathname);
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    }
  };

  if (cargando) return <div className="pantalla-carga">Cargando sistema...</div>;

  return (
    <div className="app-contenedor">
      {usuario ? (
        <div className="panel-principal">
          <header className="header-pro">
            <h2>Sistema de Costos de Empleados</h2>
            <div className="perfil-usuario">
              <img src={usuario.photoURL} alt="Perfil" />
              <span>{usuario.displayName}</span>
              <button onClick={cerrarSesion} className="btn-salir">Cerrar Sesión</button>
            </div>
          </header>
          
          <main className="contenido-principal">
            {pagoExitoso ? (
               <CostosLaborales />
            ) : (
               <div className="login-tarjeta" style={{ marginTop: '50px', textAlign: 'center' }}>
                  <h3 style={{ color: '#000' }}>¡Bienvenido, {usuario.displayName}!</h3>
                  <p style={{ color: '#333' }}>Para habilitar la calculadora de nómina, adquiere tu acceso por $20 MXN.</p>
                  <button onClick={procesarPago} className="btn-google" style={{ backgroundColor: '#28a745', color: 'white' }}>
                    Pagar Acceso
                  </button>
               </div>
            )}
          </main>
        </div>

      ) : (
        <div className="login-contenedor">
          <div className="login-tarjeta">
            <h2>Acceso Seguro</h2>
            <p className="login-subtitulo">Inicia sesión para entrar al sistema</p>
            
            <button onClick={iniciarSesion} className="btn-google">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png" 
                alt="Google logo" 
                className="icono-google"
              />
              Continuar con Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;