import React, { useState, useEffect } from 'react';
import './CalculadoraCostos.css'; // Mantenemos el CSS para los Toasts de guardado

const fmt = (n) => Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- COMPONENTES DE DISEÑO DE MENY ---
const Field = ({ label, value, onChange, prefix, suffix, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#86868B", fontWeight: 600 }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: isFocused ? "#ffffff" : "#F5F5F7",
        borderRadius: 12, padding: "12px 14px",
        transition: "all 0.2s ease", border: "1px solid transparent",
        boxShadow: isFocused ? "0 0 0 2px #0A0A0A" : "none"
      }}>
        {prefix && <span style={{ fontSize: 13, color: "#86868B", fontWeight: 600, flexShrink: 0 }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "#1D1D1F", fontSize: 15, width: "100%",
            fontFamily: "inherit", fontWeight: 500
          }}
        />
        {suffix && <span style={{ fontSize: 13, color: "#86868B", fontWeight: 600, flexShrink: 0 }}>{suffix}</span>}
      </div>
    </div>
  );
};

const Section = ({ title, badge, icon, children }) => (
  <div style={{
    background: "#ffffff", borderRadius: 24, padding: "28px",
    display: "flex", flexDirection: "column", gap: 18,
    boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1D1D1F", fontWeight: 700 }}>
          {title}
        </span>
      </div>
      {badge && (
        <span style={{
          fontSize: 10, letterSpacing: "0.06em", color: "#1D1D1F",
          background: "#F5F5F7", padding: "6px 12px", borderRadius: 20,
          fontWeight: 600, textTransform: "uppercase"
        }}>
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const TotalRow = ({ label, value }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingTop: 18, borderTop: "1px solid #E5E5EA", marginTop: 4
  }}>
    <span style={{ fontSize: 13, color: "#86868B", fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 17, fontWeight: 700, color: "#1D1D1F", fontVariantNumeric: "tabular-nums" }}>
      ${fmt(value)}
    </span>
  </div>
);

// --- COMPONENTE PRINCIPAL (TU LÓGICA INTACTA) ---
const CostosLaborales = () => {
  // ESTADOS INICIALIZADOS EN BLANCO (Sin datos precargados)
  const [empleadoId, setEmpleadoId] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [salario, setSalario] = useState('');
  
  const [imss, setImss] = useState('');
  const [infonavit, setInfonavit] = useState('');
  const [isn, setIsn] = useState('');
  const [otrosSeguros, setOtrosSeguros] = useState('');
  
  const [diasAguinaldo, setDiasAguinaldo] = useState('');
  const [diasVacaciones, setDiasVacaciones] = useState('');
  const [primaVacacional, setPrimaVacacional] = useState('');
  
  const [capacitacion, setCapacitacion] = useState('');
  const [equipo, setEquipo] = useState('');
  const [uniformes, setUniformes] = useState('');
  const [materiales, setMateriales] = useState('');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [antiguedad, setAntiguedad] = useState({ años: 0, meses: 0, dias: 0 });

  // EFECTOS MATEMÁTICOS ORIGINALES
  useEffect(() => {
    cargarDatosGuardados();
  }, []);

  useEffect(() => {
    if (fechaIngreso) calcularAntiguedad();
  }, [fechaIngreso]);

  useEffect(() => {
    if (antiguedad.años > 0) actualizarVacacionesPorAntiguedad(antiguedad.años);
  }, [antiguedad.años]);

  const calcularAntiguedad = () => {
    const ingreso = new Date(fechaIngreso);
    const hoy = new Date();
    let años = hoy.getFullYear() - ingreso.getFullYear();
    let meses = hoy.getMonth() - ingreso.getMonth();
    let dias = hoy.getDate() - ingreso.getDate();
    
    if (dias < 0) {
      meses--;
      const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      dias += ultimoMes.getDate();
    }
    if (meses < 0) {
      años--;
      meses += 12;
    }
    setAntiguedad({ años, meses, dias });
  };

  const actualizarVacacionesPorAntiguedad = (años) => {
    let dias = 12;
    if (años >= 2) dias = 14;
    if (años >= 3) dias = 16;
    if (años >= 4) dias = 18;
    if (años >= 5) dias = 20;
    if (años >= 6 && años <= 10) dias = 22;
    if (años >= 11 && años <= 15) dias = 24;
    if (años >= 16 && años <= 20) dias = 26;
    if (años >= 21 && años <= 25) dias = 28;
    if (años >= 26 && años <= 30) dias = 30;
    if (años >= 31) dias = 32;
    setDiasVacaciones(dias);
  };

  // CÁLCULOS PROTEGIDOS (Adaptados a valores vacíos)
  const getBaseMensual = () => Number(salario || 0);
  const getTotalCargas = () => Number(imss || 0) + Number(infonavit || 0) + Number(isn || 0) + Number(otrosSeguros || 0);
  
  const getTotalPrestaciones = () => {
    const salarioDiario = Number(salario || 0) / 30.4;
    const aguinaldoMensual = (salarioDiario * Number(diasAguinaldo || 0)) / 12;
    const vacacionesMensual = (salarioDiario * Number(diasVacaciones || 0)) / 12;
    const primaMensual = vacacionesMensual * 0.25;
    
    if (Math.abs(Number(primaVacacional || 0) - primaMensual) > 0.01) {
        setTimeout(() => setPrimaVacacional(primaMensual), 0);
    }
    return aguinaldoMensual + vacacionesMensual + primaMensual;
  };
  
  const getTotalAdicionales = () => Number(capacitacion || 0) + Number(equipo || 0) + Number(uniformes || 0) + Number(materiales || 0);
  
  const getGranTotal = () => getBaseMensual() + getTotalCargas() + getTotalPrestaciones() + getTotalAdicionales();

  // CONEXIÓN A MONGODB INTACTA
  const guardarDatos = async () => {
    try {
      const datosGuardar = {
        empleadoId, nombre, fechaIngreso, salario, imss,
        infonavit, isn, otrosSeguros, diasAguinaldo,
        diasVacaciones, primaVacacional, capacitacion,
        equipo, uniformes, materiales
      };

      const respuesta = await fetch('http://localhost:5005/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosGuardar)
      });

      if (respuesta.ok) {
        mostrarToast('Guardado en MongoDB', 'success');
        localStorage.setItem(`empleado_${empleadoId}`, JSON.stringify(datosGuardar));
      } else {
        mostrarToast('Error al guardar en la base de datos', 'error');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      mostrarToast('Error de conexión con el servidor', 'error');
    }
  };

  const cargarDatosGuardados = () => {
    try {
      const datosGuardados = localStorage.getItem('costosLaborales_backup');
      if (!datosGuardados) return;
      const datos = JSON.parse(datosGuardados);
      
      setEmpleadoId(datos.empleadoId || '');
      setNombre(datos.nombre || '');
      setFechaIngreso(datos.fechaIngreso || '');
      setSalario(datos.salario || '');
      setImss(datos.imss || '');
      setInfonavit(datos.infonavit || '');
      setIsn(datos.isn || '');
      setOtrosSeguros(datos.otrosSeguros || '');
      setDiasAguinaldo(datos.diasAguinaldo || '');
      setDiasVacaciones(datos.diasVacaciones || '');
      setPrimaVacacional(datos.primaVacacional || '');
      setCapacitacion(datos.capacitacion || '');
      setEquipo(datos.equipo || '');
      setUniformes(datos.uniformes || '');
      setMateriales(datos.materiales || '');
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const restaurarValoresIniciales = () => {
    setEmpleadoId(''); setNombre(''); setFechaIngreso(''); setSalario('');
    setImss(''); setInfonavit(''); setIsn(''); setOtrosSeguros('');
    setDiasAguinaldo(''); setDiasVacaciones(''); setPrimaVacacional('');
    setCapacitacion(''); setEquipo(''); setUniformes(''); setMateriales('');
    setAntiguedad({ años: 0, meses: 0, dias: 0 });
    mostrarToast('Formulario limpiado', 'success');
  };

  const cargarEmpleado = async () => {
    if (!empleadoId.trim()) {
      mostrarToast('Ingresa un ID de empleado', 'error');
      return;
    }
    try {
      const respuesta = await fetch(`http://localhost:5005/api/empleados/${empleadoId}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setNombre(datos.nombre); setFechaIngreso(datos.fechaIngreso); setSalario(datos.salario);
        setImss(datos.imss); setInfonavit(datos.infonavit); setIsn(datos.isn); setOtrosSeguros(datos.otrosSeguros);
        setDiasAguinaldo(datos.diasAguinaldo); setDiasVacaciones(datos.diasVacaciones); setPrimaVacacional(datos.primaVacacional);
        setCapacitacion(datos.capacitacion); setEquipo(datos.equipo); setUniformes(datos.uniformes); setMateriales(datos.materiales);
        mostrarToast('Datos recuperados de MongoDB', 'success');
      } else {
        mostrarToast('Empleado no encontrado en la base de datos', 'error');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      mostrarToast('Error de conexión con el servidor', 'error');
    }
  };

  const mostrarToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // --- RENDER CON DISEÑO DE MENY ---
  return (
    <div style={{
      minHeight: "100vh", background: "#F5F5F7", color: "#1D1D1F", padding: "0 0 120px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", sans-serif'
    }}>
      <div style={{ padding: "40px 24px", maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Cabecera y Botones */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
              Costo laboral · Chiapas 2026
            </h1>
            <p style={{ fontSize: 15, color: "#86868B", margin: 0, fontWeight: 400 }}>
              Base de datos activa. Puedes buscar por ID, ajustar valores y guardar en la nube.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={restaurarValoresIniciales} style={{
              background: "transparent", border: "1px solid #D1D1D6", color: "#1D1D1F", padding: "12px 20px", 
              borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              <span>↺</span> Limpiar
            </button>
            <button onClick={guardarDatos} style={{
              background: "#0A0A0A", border: "none", color: "#ffffff", padding: "12px 24px", 
              borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
            }}>
              Guardar cambios
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda conectada a Mongo */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", background: "#ffffff", borderRadius: 14, 
            padding: "0 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            <span style={{ color: "#86868B", fontSize: 18, marginRight: 12 }}>🔍</span>
            <input
              placeholder="Buscar empleado por ID (ej. 243395)..."
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && cargarEmpleado()}
              style={{ background: "transparent", border: "none", outline: "none", color: "#1D1D1F", fontSize: 15, width: "100%", padding: "18px 0" }}
            />
          </div>
          <button onClick={cargarEmpleado} style={{
            background: "#1D1D1F", color: "#ffffff", border: "none", borderRadius: 14, padding: "0 24px", fontWeight: 600, cursor: "pointer"
          }}>
            Buscar
          </button>
        </div>

        {/* Grid de Tarjetas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          <Section title="Servicio I · Empleado" badge="editable" icon="👤">
            <Field label="Nombre completo" value={nombre} onChange={setNombre} />
            <Field label="Salario mensual" value={salario} onChange={setSalario} prefix="MXN" type="number" />
            <Field label="Fecha de ingreso" value={fechaIngreso} onChange={setFechaIngreso} type="date" />
            
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#86868B", fontWeight: 600 }}>Antigüedad</label>
              <div style={{ display: "flex", alignItems: "center", background: "#F5F5F7", borderRadius: 12, padding: "12px 14px", fontSize: 15 }}>
                <span style={{ color: "#0A0A0A", fontWeight: 700, marginRight: 4 }}>{antiguedad.años}</span> años, 
                <span style={{ color: "#0A0A0A", fontWeight: 700, margin: "0 4px 0 8px" }}>{antiguedad.meses}</span> meses
              </div>
            </div>
            
            <TotalRow label="Base mensual" value={getBaseMensual()} />
          </Section>

          <Section title="Servicio II · Cargas Legales" badge="oficial + ajuste" icon="⚖️">
            <Field label="IMSS patronal" value={imss} onChange={setImss} prefix="MXN" type="number" />
            <Field label="Infonavit (5%)" value={infonavit} onChange={setInfonavit} prefix="MXN" type="number" />
            <Field label="ISN Chiapas 3%" value={isn} onChange={setIsn} prefix="MXN" type="number" />
            <Field label="Otros seguros" value={otrosSeguros} onChange={setOtrosSeguros} prefix="MXN" type="number" />
            <TotalRow label="Total cargas" value={getTotalCargas()} />
          </Section>

          <Section title="Servicio III · Prestaciones" badge="calculado + editable" icon="🎁">
            <Field label="Aguinaldo (Días)" value={diasAguinaldo} onChange={setDiasAguinaldo} suffix="Días" type="number" />
            <Field label="Vacaciones (Días)" value={diasVacaciones} onChange={setDiasVacaciones} suffix="Días" type="number" />
            <Field label="Prima vacacional" value={primaVacacional} onChange={setPrimaVacacional} prefix="MXN" type="number" />
            <TotalRow label="Total prestaciones" value={getTotalPrestaciones()} />
          </Section>

          <Section title="Servicio IV · Adicionales" badge="ajustable" icon="🧰">
            <Field label="Capacitación" value={capacitacion} onChange={setCapacitacion} prefix="MXN" type="number" />
            <Field label="Equipo / herramientas" value={equipo} onChange={setEquipo} prefix="MXN" type="number" />
            <Field label="Uniformes / EPP" value={uniformes} onChange={setUniformes} prefix="MXN" type="number" />
            <Field label="Materiales" value={materiales} onChange={setMateriales} prefix="MXN" type="number" />
            <TotalRow label="Total adicionales" value={getTotalAdicionales()} />
          </Section>
        </div>
      </div>

      {/* Footer Flotante con el Total */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10, 10, 10, 0.85)", backdropFilter: "blur(20px)",
        padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#86868B", fontWeight: 700 }}>Costo Total · Mensual</div>
          <div style={{ fontSize: 13, color: "#D1D1D6", marginTop: 4, fontWeight: 500 }}>Empresa · MXN</div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
          ${fmt(getGranTotal())}
        </div>
      </div>

      {/* TUS TOASTS ORIGINALES DE MONGODB */}
      {toast.show && (
        <div className={`toast show ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CostosLaborales;