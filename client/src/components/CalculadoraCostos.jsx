import React, { useState, useEffect } from 'react';
import './CalculadoraCostos.css';

const CostosLaborales = () => {
  const [empleadoId, setEmpleadoId] = useState('243395');
  const [nombre, setNombre] = useState('Juan Pérez López');
  const [fechaIngreso, setFechaIngreso] = useState('2020-03-15');
  const [salario, setSalario] = useState(12500);
  
  const [imss, setImss] = useState(2100);
  const [infonavit, setInfonavit] = useState(625);
  const [isn, setIsn] = useState(375);
  const [otrosSeguros, setOtrosSeguros] = useState(250);
  
  const [diasAguinaldo, setDiasAguinaldo] = useState(15);
  const [diasVacaciones, setDiasVacaciones] = useState(20);
  const [primaVacacional, setPrimaVacacional] = useState(260.42);
  
  const [capacitacion, setCapacitacion] = useState(400);
  const [equipo, setEquipo] = useState(500);
  const [uniformes, setUniformes] = useState(250);
  const [materiales, setMateriales] = useState(150);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [antiguedad, setAntiguedad] = useState({ años: 5, meses: 11, dias: 10 });

  useEffect(() => {
    cargarDatosGuardados();
  }, []);

  useEffect(() => {
    calcularAntiguedad();
  }, [fechaIngreso]);

  useEffect(() => {
    actualizarVacacionesPorAntiguedad(antiguedad.años);
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

  const getBaseMensual = () => salario;
  const getTotalCargas = () => imss + infonavit + isn + otrosSeguros;
  
  const getTotalPrestaciones = () => {
    const salarioDiario = salario / 30.4;
    const aguinaldoMensual = (salarioDiario * diasAguinaldo) / 12;
    const vacacionesMensual = (salarioDiario * diasVacaciones) / 12;
    const primaMensual = vacacionesMensual * 0.25;
    
    setTimeout(() => setPrimaVacacional(primaMensual), 0);
    return aguinaldoMensual + vacacionesMensual + primaMensual;
  };
  
  const getTotalAdicionales = () => capacitacion + equipo + uniformes + materiales;
  
  const getGranTotal = () => {
    return salario + getTotalCargas() + getTotalPrestaciones() + getTotalAdicionales();
  };

  const formatearMoneda = (valor) => {
    return '$' + valor.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGuardar)
      });

      if (respuesta.ok) {
        mostrarToast('Guardado en MongoDB ', 'success');
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
      
      setEmpleadoId(datos.empleadoId || '243395');
      setNombre(datos.nombre || 'Juan Pérez López');
      setFechaIngreso(datos.fechaIngreso || '2020-03-15');
      setSalario(datos.salario || 12500);
      setImss(datos.imss || 2100);
      setInfonavit(datos.infonavit || 625);
      setIsn(datos.isn || 375);
      setOtrosSeguros(datos.otrosSeguros || 250);
      setDiasAguinaldo(datos.diasAguinaldo || 15);
      setDiasVacaciones(datos.diasVacaciones || 20);
      setPrimaVacacional(datos.primaVacacional || 260.42);
      setCapacitacion(datos.capacitacion || 400);
      setEquipo(datos.equipo || 500);
      setUniformes(datos.uniformes || 250);
      setMateriales(datos.materiales || 150);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const restaurarValoresIniciales = () => {
    setEmpleadoId('243395');
    setNombre('Juan Pérez López');
    setFechaIngreso('2020-03-15');
    setSalario(12500);
    setImss(2100);
    setInfonavit(625);
    setIsn(375);
    setOtrosSeguros(250);
    setDiasAguinaldo(15);
    setDiasVacaciones(20);
    setPrimaVacacional(260.42);
    setCapacitacion(400);
    setEquipo(500);
    setUniformes(250);
    setMateriales(150);
    
    mostrarToast('Valores restaurados', 'success');
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
        
        setNombre(datos.nombre);
        setFechaIngreso(datos.fechaIngreso);
        setSalario(datos.salario);
        setImss(datos.imss);
        setInfonavit(datos.infonavit);
        setIsn(datos.isn);
        setOtrosSeguros(datos.otrosSeguros);
        setDiasAguinaldo(datos.diasAguinaldo);
        setDiasVacaciones(datos.diasVacaciones);
        setPrimaVacacional(datos.primaVacacional);
        setCapacitacion(datos.capacitacion);
        setEquipo(datos.equipo);
        setUniformes(datos.uniformes);
        setMateriales(datos.materiales);

        mostrarToast('Datos recuperados de MongoDB ', 'success');
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

  return (
    <div className="container">
      <div className="header">
        <h1>Costo laboral · Chiapas 2026</h1>
        <p>Los montos oficiales vienen pre-cargados. Tú puedes ajustar salario, fecha de ingreso y extras manualmente.</p>
      </div>

      <div className="action-buttons">
        <button className="btn btn-outline" onClick={restaurarValoresIniciales}>
          ↺ Restaurar
        </button>
        <button className="btn btn-success" onClick={guardarDatos}>
          Guardar cambios
        </button>
      </div>

      <div className="search-section">
        <input 
          type="text" 
          placeholder="ID del empleado (ej. 243395)" 
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && cargarEmpleado()}
        />
        <button onClick={cargarEmpleado}>Buscar</button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>👤 Servicio I · Empleado</h3>
            <span className="badge">editable</span>
          </div>
          <div className="editable-item">
            <label>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '160px', textAlign: 'left' }} />
          </div>
          <div className="editable-item">
            <label>Salario mensual</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={salario} onChange={(e) => setSalario(parseFloat(e.target.value) || 0)} step="100" />
            </div>
          </div>
          <div className="editable-item">
            <label>Fecha de ingreso</label>
            <div className="value">
              <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
            </div>
          </div>
          <div className="editable-item">
            <label>Antigüedad</label>
            <div className="antiguedad-display">
              <span>{antiguedad.años}</span> años, <span>{antiguedad.meses}</span> meses, <span>{antiguedad.dias}</span> días
            </div>
          </div>
          <div className="subtotal">
            <span>Base mensual</span>
            <span>{formatearMoneda(getBaseMensual())}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3> Servicio II · Cargas legales</h3>
            <span className="badge">oficial + ajuste</span>
          </div>
          <div className="editable-item">
            <label>IMSS patronal <span className="highlight">tasa fija</span></label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={imss} onChange={(e) => setImss(parseFloat(e.target.value) || 0)} step="10" />
            </div>
          </div>
          <div className="editable-item">
            <label>Infonavit (5%) <span className="highlight">por ley</span></label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={infonavit} onChange={(e) => setInfonavit(parseFloat(e.target.value) || 0)} step="5" />
            </div>
          </div>
          <div className="editable-item">
            <label>ISN Chiapas 3%</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={isn} onChange={(e) => setIsn(parseFloat(e.target.value) || 0)} step="5" />
            </div>
          </div>
          <div className="editable-item">
            <label>Otros seguros</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={otrosSeguros} onChange={(e) => setOtrosSeguros(parseFloat(e.target.value) || 0)} step="10" />
            </div>
          </div>
          <div className="subtotal">
            <span>Total cargas</span>
            <span>{formatearMoneda(getTotalCargas())}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3> Servicio III · Prestaciones</h3>
            <span className="badge">calculado + editable</span>
          </div>
          <div className="editable-item">
            <label>Aguinaldo (días)</label>
            <div className="value">
              <input type="number" value={diasAguinaldo} onChange={(e) => setDiasAguinaldo(parseFloat(e.target.value) || 15)} min="15" max="30" step="1" />
              <span className="currency">días</span>
            </div>
          </div>
          <div className="editable-item">
            <label>Vacaciones <span className="highlight">según años</span></label>
            <div className="value">
              <input type="number" value={diasVacaciones} onChange={(e) => setDiasVacaciones(parseFloat(e.target.value) || 12)} min="6" max="30" step="1" />
              <span className="currency">días</span>
            </div>
          </div>
          <div className="editable-item">
            <label>Prima vacacional</label>
            <div className="value">
              <input type="number" value={primaVacacional.toFixed(2)} onChange={(e) => setPrimaVacacional(parseFloat(e.target.value) || 0)} step="10" />
            </div>
          </div>
          <div className="subtotal">
            <span>Total prestaciones</span>
            <span>{formatearMoneda(getTotalPrestaciones())}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3> Servicio IV · Adicionales</h3>
            <span className="badge">ajustable</span>
          </div>
          <div className="editable-item">
            <label>Capacitación</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={capacitacion} onChange={(e) => setCapacitacion(parseFloat(e.target.value) || 0)} step="20" />
            </div>
          </div>
          <div className="editable-item">
            <label>Equipo/herramientas</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={equipo} onChange={(e) => setEquipo(parseFloat(e.target.value) || 0)} step="50" />
            </div>
          </div>
          <div className="editable-item">
            <label>Uniformes/EPP</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={uniformes} onChange={(e) => setUniformes(parseFloat(e.target.value) || 0)} step="10" />
            </div>
          </div>
          <div className="editable-item">
            <label>Materiales</label>
            <div className="value">
              <span className="currency">MXN</span>
              <input type="number" value={materiales} onChange={(e) => setMateriales(parseFloat(e.target.value) || 0)} step="10" />
            </div>
          </div>
          <div className="subtotal">
            <span>Total adicionales</span>
            <span>{formatearMoneda(getTotalAdicionales())}</span>
          </div>
        </div>
      </div>

      <div className="total-card">
        <span className="label">COSTO TOTAL PARA LA EMPRESA · mensual</span>
        <span className="amount">
          {formatearMoneda(getGranTotal())} <small>MXN</small>
        </span>
      </div>

      <div className="footnote">
         Ajusta cualquier valor directamente. Los cambios se reflejan en tiempo real.
      </div>

      {toast.show && (
        <div className={`toast show ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CostosLaborales;