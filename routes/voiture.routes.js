const express = require('express');
const router = express.Router();
const VoitureController = require('../controllers/voiture.controller');
const {upload} = require('../gestion_image/cloudinary');
router.get('/',VoitureController.getAllVoitures);
router.post('/',VoitureController.createVoiture);
router.put('/:id',VoitureController.UpdateVoiture);
router.delete('/:id',VoitureController.DeleteVoiture);

// routes pour les images avec IA
router.post('/upload-with-bg-removal',upload.single('image'),VoitureController.uploadImageWithBackgroundRemoval);
router.get('/:publicId/background-variants',VoitureController.generateBackgroundVariants);
router.delete('image/publicId',VoitureController,VoitureController.deleteImage);
module.exports = router;