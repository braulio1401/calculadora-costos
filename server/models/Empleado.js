const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  empleadoId: { type: String, required: true },
  nombre: { type: String, required: true },
  fechaIngreso: { type: String },
  salario: { type: Number },
  
  imss: { type: Number },
  infonavit: { type: Number },
  isn: { type: Number },
  otrosSeguros: { type: Number },
  
  diasAguinaldo: { type: Number },
  diasVacaciones: { type: Number },
  primaVacacional: { type: Number },
  
  capacitacion: { type: Number },
  equipo: { type: Number },
  uniformes: { type: Number },
  materiales: { type: Number }
}, {
  timestamps: true
});

module.exports = mongoose.model('Empleado', EmpleadoSchema);