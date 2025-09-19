const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.Supabase.controller');

// Routes pour les utilisateurs

router.get('/users',clientController.getAllUsers);
router.patch('/users/:id',clientController.updateUser);
router.get('/users/searchUser',clientController.searchUsers);
router.delete('/users/:id',clientController.deleteUser);
router.get('/users/stats', clientController.getUserStats);
router.get('/users/:id',clientController.getUserById);

module.exports = router;