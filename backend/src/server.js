const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require("dotenv").config();
// const path = require('path');
// dotenv.config({ path: path.join(__dirname, '../.env') });


const app = express();


app.use(helmet());


const allowedOrigins = [
    process.env.FRONTEND_URL
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        console.warn(`CORS Bloqué pour l'origine: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Pas de middleware global xss/mongo cause Express v5 incompat

const authLimiter = rateLimit({
    max: 30, // Limit each IP to 20 requests per windowMs
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes.'
});
app.use('/api/auth', authLimiter);

mongoose.set('sanitizeFilter', true);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Atlas Connecté avec succès');
        console.log(`Base de données: ${mongoose.connection.name}`);
    })
    .catch(err => {
        console.error('Erreur de connexion MongoDB:');
        console.error(err);
    });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Quelque chose s\'est mal passé !', error: err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
