const express = require('express');
const cors = require('cors');
//connecter la base de données
const connectDB = require('./config/database');
connectDB()
//fin

const app = express();
// configuration CORS
app.use(cors({
  origin:'http://localhost:4200',
  credentials:true
}));
app.use(express.json());

//routes pour les voitures
const voitureRoutes = require('./routes/voiture.routes.js');
app.use('/api/voitures',voitureRoutes);
//fin

//api pour Admin
const adminRoutes = require('./routes/admin.routes.js');
app.use('/api/admin',adminRoutes);
//fin

//api pour reservation
const reservationRoutes = require('./routes/reservation.routes.js');
app.use('/api/reservation',reservationRoutes);
//fin

// api pour gerer les clients
const clientRoutes = require('./routes/client.routes.js');
app.use('/api/clients',clientRoutes);
// fin

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

module.exports = app;