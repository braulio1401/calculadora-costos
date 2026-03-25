import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from './firebase';
import CostosLaborales from './components/CalculadoraCostos';
import './App.css';
import Login from './components/Login';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);


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
                  <h3 style={{ color: '#000' }}>Bienvenido, {usuario.displayName}!</h3>
                  <p style={{ color: '#333' }}>Para acceder a la calculadora de costos de empleados requieres pagar una suscripción de $20 MXN.</p>
                  <button onClick={procesarPago} className="btn-google" style={{ backgroundColor: '#28a745', color: 'white' }}>
                    Pagar Acceso
                  </button>
               </div>
            )}
          </main>
        </div>

      ) : (
        <Login onLogin={(user) => console.log("Usuario conectado", user)} />
      )}
    </div>
  );
}

export default App;