const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');

// Obtenir toutes les réservations
router.get('/', reservationController.getAllReservations);

// Créer une nouvelle réservation
router.post('/', reservationController.createReservation);

// Modifier une réservation
router.put('/:id', reservationController.updateReservation);

// Supprimer une réservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router; 