const mongoose = require('mongoose');

const VoitureSchema = new mongoose.Schema({
marque: {type: String, require: true},
modele: {type:String, require: true},
annee: {type:String, require: true},
prixParJour: {type:Number, require: true},
disponible: {type:Boolean, require: true}
});
module.exports = mongoose.model('Voiture',VoitureSchema);