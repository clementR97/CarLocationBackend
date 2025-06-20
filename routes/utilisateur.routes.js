const express = require('express');
const router = express.Router();
const utilisateurController = require('../controller/utilisateur.controller');

// Obtenir tous les utilisateurs
router.get('/', utilisateurController.getAllUtilisateurs);

// Créer un nouvel utilisateur
router.post('/', utilisateurController.createUtilisateur);

// Modifier un utilisateur
router.put('/:id', utilisateurController.updateUtilisateur);

// Supprimer un utilisateur
router.delete('/:id', utilisateurController.deleteUtilisateur);

module.exports = router; 