const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: {type: String, require: true},
  email: {type: String, require: true},
  motdePasse: {type: String, require: true},
  role: {type: String, enum:['admin','utilisateur'],default: 'utilisateur'}
});
module.exports('Utilisateur',utilisateurSchema);