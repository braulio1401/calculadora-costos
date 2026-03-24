require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

const rutasEmpleados = require('./routes/empleados');
const rutasPagos = require('./routes/pagos');

app.use('/api/empleados', rutasEmpleados);
app.use('/api/pagos', rutasPagos);

/* RUTA DE PAGO ACTUALIZADA A LA NUEVA VERSION DE STRIPE */;
app.post('/api/pago', async (req, res) => {
    try {
        const monto = req.body.monto;
        const r = req.body.r;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: 'Acceso a Calculadora de Nómina'
                    },
                    unit_amount: monto * 100
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: 'https://calculadora-costos-rouge.vercel.app/?pago=exito',
            cancel_url: 'https://calculadora-costos-rouge.vercel.app/'
        });

        /* AHORA ENVIAMOS LA URL DIRECTA, NO EL ID */;
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor de Costo de Empleados funcionando al 100% con Stripe');
});

/* Forzamos la conexion a IPv4 para Mongo */;
mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
.then(() => {
    console.log(' Conectado a MongoDB Atlas');
    app.listen(process.env.PORT, () => {
        console.log(` Servidor corriendo en el puerto ${process.env.PORT}`);
    });
})
.catch((error) => console.error(' Error conectando a Mongo: ', error));