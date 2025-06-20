const Voiture = require('../models/voiture.model');
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
            disponible: req.body.disponible
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

