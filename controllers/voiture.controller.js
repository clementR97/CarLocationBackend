const { cloudinary } = require('../gestion_image/cloudinary');
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
            images: req.body.images || [],
            description: req.body.description,
            caracteristiques: req.body.caracteristiques,
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

// upload et supprimer le fond d'une photo

exports.uploadImageWithBackgroundRemoval = async (req,res)=>{
try{
    const file = req.file;
    const backgroundColor = req.body.backgroundColor || 'lightgray';
    // upload initial de l'image
    const uploadResult = await cloudinary.uploader.upload(file.path,{
        folder:'carrent-voitures',
        transformation:[
            {width:800, height:600,crop:'fill',quality:'auto'}
        ]
    });
    // generer l'URL sans arriere-plan
    const background_removedUrl = cloudinary.url(uploadResult.public_id,{
        transformation:[
            {effect: 'background_removal'},
            {with:800, height:600, crop: 'fill'}
        ]
    });
    // generer l'url avec fond gris
    const withGrayBackgroundUrl = cloudinary.url(uploadResult.public_id,{
        transformation:[
            {effect:'background_removal'},
            {color: 'lightgray',width:800,height:600,crop:'fill'},
            {flags: 'layer_apply',gravity:'center'}
        ]
    });
    // generer l'url avec fond personalisé
    const withCustomBackgroundUrl = cloudinary.url(uploadResult.public_id,{
        transformation:[
            {effect: 'background_removal'},
            {color: backgroundColor, width:800, height:600,crop:'fill'},
            {flags: 'layer_apply',gravity:'center'}
        ]
    });
    res.json({
        original:uploadResult.secure_url,
        backgroundRemoved: background_removedUrl,
        withGrayBackground:withGrayBackgroundUrl,
        withCustomBackground:withCustomBackgroundUrl,
        public_id: uploadResult.public_id
    });
}catch(error){
    console.error('Erreur Cloudinary:',error);
    res.status(500).json({message: error.message});
}
};
exports.generateBackgroundVariants = async (req,res) => {
    try{
        const {publicId} = req.params;
        const backgrounds = [
            {name:'Gris clair',value: 'lightgray'},
            {name:'Blanc',value:'white'},
            {name:'Noir',value:'black'},
            {name:'Bleu',value:'blue'},
            {name:'Vert',value:'green'},
            {name: 'Rouge',value:'red'}
        ];
        const variants = [];
        for(let bg of backgrounds){
            const variantUrl = cloudinary.url(publicId,{
                transformation:[
                    {effect:'background_removal'},
                    {color: bg.value,width:800,height:600,crop:'fill'},
                    {flags: 'layer_apply',gravity:'center'}
                ]
            });
            variants.push({
                name:bg.name,
                color:bg.value,
                url: variantUrl
            });
        }
        res.json({variants});
    }catch(error){
        res.status(500).json({message:error.message});
    }
};
// supprimer une image de cloudinary
exports.deleteImage = async(req,res)=>{
    try{
        const{publicId}= req.params;
        await cloudinary.uploader.destroy(publicId);
        res.json({message:'Image supprimer avec succes'});
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

