const Voiture = require('../models/voiture.model');
const { cloudinary, upload } = require('../config/cloudinary');

//methode pour afficher les voitures
exports.getAllVoitures = async(req,res)=>{
try{
    const voitures = await Voiture.find();
    res.json(voitures);
}
catch(err){
    res.status(500).json({message: err.message});
}
};

//methode pour ajouter une voiture
exports.createVoiture = async(req,res)=>{
        const voiture = new Voiture({
            marque: req.body.marque,
            modele: req.body.modele,
            annee: req.body.annee,
            prixParJour: req.body.prixParJour,
            disponible: req.body.disponible,
            images: req.body.images || [],
            description: req.body.description,
            caracteristiques: req.body.caracteristiques || []
        });
    try{
        const NewVoiture = await voiture.save();
        res.status(201).json(NewVoiture);
    }catch(err){
        res.status(400).json({message: err.message});
    }
};

//modifier une voiture
exports.UpdateVoiture = async(req,res)=>{
    try{
        const voiture = await Voiture.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if(!voiture) return res.status(404).json({message: 'Voiture non trouvée'});
        res.json(voiture);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
};

//supprimer une voiture
exports.DeleteVoiture = async(req,res)=>{
    try{
        const voiture = await Voiture.findByIdAndDelete(req.params.id);
        if(!voiture) return res.status(404).json({message:'Voiture non trouvée'});
        res.json({message: 'Voiture supprimée'});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

// Upload d'image avec suppression d'arrière-plan IA (optimisé pour plan gratuit)
exports.uploadImageWithBackgroundRemoval = async (req, res) => {
  try {
    const file = req.file;
    const backgroundColor = req.body.backgroundColor || 'lightgray';
    
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    // Vérifier la taille du fichier (limite 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Fichier trop volumineux (max 10MB)' });
    }

    // Upload initial avec compression pour économiser les crédits
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'carrent-voitures',
      transformation: [
        { width: 600, height: 400, crop: 'fill', quality: 'auto:low' } // Réduction de la taille
      ]
    });

    // Générer l'URL sans arrière-plan (une seule fois pour économiser les crédits)
    const backgroundRemovedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { effect: 'background_removal' },
        { width: 600, height: 400, crop: 'fill' }
      ]
    });

    // Pour les autres variantes, on utilise la même image sans arrière-plan
    // et on ajoute juste le fond avec CSS ou des transformations simples
    const withGrayBackgroundUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { effect: 'background_removal' },
        { width: 600, height: 400, crop: 'fill', background: 'lightgray' }
      ]
    });

    const withCustomBackgroundUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { effect: 'background_removal' },
        { width: 600, height: 400, crop: 'fill', background: backgroundColor }
      ]
    });

    res.json({
      original: uploadResult.secure_url,
      backgroundRemoved: backgroundRemovedUrl,
      withGrayBackground: withGrayBackgroundUrl,
      withCustomBackground: withCustomBackgroundUrl,
      public_id: uploadResult.public_id,
      creditsUsed: 1 // Information pour l'utilisateur
    });

  } catch (error) {
    console.error('Erreur Cloudinary:', error);
    res.status(500).json({ message: error.message });
  }
};

// Générer des variantes d'arrière-plan (optimisé)
exports.generateBackgroundVariants = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Limiter à 3 variantes pour économiser les crédits
    const backgrounds = [
      { name: 'Gris clair', value: 'lightgray' },
      { name: 'Blanc', value: 'white' },
      { name: 'Noir', value: 'black' }
    ];
    const variants = [];

    for (let bg of backgrounds) {
      const variantUrl = cloudinary.url(publicId, {
        transformation: [
          { effect: 'background_removal' },
          { width: 600, height: 400, crop: 'fill', background: bg.value }
        ]
      });
      
      variants.push({
        name: bg.name,
        color: bg.value,
        url: variantUrl
      });
    }

    res.json({ 
      variants,
      creditsUsed: 3,
      message: 'Variantes générées (3 crédits utilisés)'
    });
  } catch (error) {
    console.error('Erreur génération variantes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une image de Cloudinary
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    await cloudinary.uploader.destroy(publicId);
    
    res.json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Méthode pour vérifier les crédits restants
exports.checkCredits = async (req, res) => {
  try {
    const result = await cloudinary.api.usage();
    res.json({ 
      message: 'Statut des crédits Cloudinary',
      credits: result,
      plan: 'Gratuit (25 crédits/mois)'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur vérification crédits', error: error.message });
  }
};

// Test de connexion Cloudinary
exports.testCloudinary = async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ 
      message: 'Connexion Cloudinary OK', 
      result: result,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      plan: 'Gratuit avec suppression d\'arrière-plan'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur Cloudinary', error: error.message });
  }
};

