const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/crear-pago', async (req, res) => {
    try {
        const { monto } = req.body; 

        const paymentIntent = await stripe.paymentIntents.create({
            amount: monto || 50000, 
            currency: 'mxn', 
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("❌ Error con Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;