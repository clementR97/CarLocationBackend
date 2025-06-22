const Reservation = require('../models/reservation.model');

// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('utilisateur voiture');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  const reservation = new Reservation({
    utilisateur: req.body.utilisateur,
    voiture: req.body.voiture,
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
    statut: req.body.statut || 'en attente'
  });
  try {
    const nouvelleReservation = await reservation.save();
    res.status(201).json(nouvelleReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier une réservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 