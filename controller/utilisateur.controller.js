const Utilisateur = require('../models/utilisateur.model');

// Obtenir tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouvel utilisateur
exports.createUtilisateur = async (req, res) => {
  const utilisateur = new Utilisateur({
    nom: req.body.nom,
    email: req.body.email,
    motdePasse: req.body.motdePasse,
    role: req.body.role || 'utilisateur'
  });
  try {
    const nouvelUtilisateur = await utilisateur.save();
    res.status(201).json(nouvelUtilisateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Modifier un utilisateur
exports.updateUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(utilisateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 