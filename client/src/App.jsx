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
               /* AQUÍ ENTRA ÚNICAMENTE EL DISEÑO DE MENY PARA LA TARJETA */
               <div style={{
                 background: "#f5efe4", border: "1.5px solid #c8b48a",
                 borderRadius: 20, padding: "40px 32px",
                 maxWidth: 420, margin: "50px auto", textAlign: "center",
                 boxShadow: "0 10px 30px rgba(58, 46, 30, 0.08)", display: "flex",
                 flexDirection: "column", gap: 18
               }}>
                  <div style={{ fontSize: 42, marginBottom: "-5px" }}>✨</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#3a2e1e", letterSpacing: "-0.02em" }}>
                    Hola, {usuario.displayName.split(' ')[0]}
                  </h3>
                  <p style={{ fontSize: 15, color: "#5a4a30", margin: "0 0 8px", lineHeight: 1.5 }}>
                    Estás a un paso de optimizar tu gestión. Desbloquea el acceso completo a la calculadora de costos laborales por una suscripción de <strong style={{ color: "#7a5a20", fontSize: 16 }}>$20 MXN</strong>.
                  </p>
                  <button onClick={procesarPago} style={{
                    background: "#3a2e1e", border: "none", color: "#f5efe4",
                    padding: "16px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                    width: "100%", letterSpacing: "0.02em"
                  }}>
                    Desbloquear Acceso
                  </button>
                  <div style={{ fontSize: 12, color: "#9a8050", marginTop: "4px", letterSpacing: "0.02em" }}>
                    🔒 Pago seguro · Acceso inmediato
                  </div>
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