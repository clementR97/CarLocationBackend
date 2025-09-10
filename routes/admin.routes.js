const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin.auth.controller');
const carrentAdminController = require('../controllers/carrent.admin.controller');

const { authenticateAdmin, requireRole } = require('../middleware/adminAuth');

// Routes d'authentification admin (publiques)
router.post('/login', adminAuthController.loginAdmin);
router.post('/create-first', adminAuthController.createFirstAdmin);

// Routes protégées admin
router.use(authenticateAdmin); // Toutes les routes suivantes nécessitent une auth admin

// Gestion utilisateurs
// router.get('/users', 
//   requireRole(['admin', 'super_admin']), 
//   utilisateursAdminController.getAllUtilisateurs
// );

// router.put('/users/:id', 
//   requireRole(['admin', 'super_admin']), 
//   utilisateursAdminController.updateUtilisateur
// );

// router.delete('/users/:id', 
//   requireRole(['super_admin']), // Seulement super_admin peut supprimer
//   utilisateursAdminController.deleteUtilisateur
// );

router.get('/dashboard', 
    requireRole(['admin', 'super_admin']), 
    carrentAdminController.getDashboardStats
  );
  
  router.get('/vehicles', 
    requireRole(['admin', 'super_admin']), 
    carrentAdminController.getVehicles
  );

// Route pour vérifier le statut admin
router.get('/me', (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      nom: req.admin.nom,
      email: req.admin.email,
      role: req.admin.role,
      lastLogin:req.admin.lastLogin
    }
  });
});

module.exports = router;