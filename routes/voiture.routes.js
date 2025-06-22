const express = require('express');
const router = express.Router();
const VoitureController = require('../controllers/voiture.controller');

router.get('/',VoitureController.getAllVoitures);
router.post('/',VoitureController.createVoiture);
router.put('/:id',VoitureController.UpdateVoiture);
router.delete('/:id',VoitureController.DeleteVoiture);

module.exports = router;