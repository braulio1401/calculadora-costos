const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

router.post('/', async (req, res) => {
    try {
        const nuevoEmpleado = new Empleado(req.body);
        await nuevoEmpleado.save();
        res.status(201).json({ mensaje: 'Empleado guardado', empleado: nuevoEmpleado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Hubo un error al guardar', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la lista', error });
    }
});

router.get('/:id', async (req, res) => {
    try {

        const empleado = await Empleado.findOne({ empleadoId: req.params.id });
        
        if (empleado) {
            res.status(200).json(empleado);
        } else {
            res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en la búsqueda', error });
    }
});

module.exports = router;