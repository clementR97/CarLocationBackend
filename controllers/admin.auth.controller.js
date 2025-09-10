const Admin = require('../models/admin.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// login admin

exports.loginAdmin = async(req,res)=>{
    try{
        const {email,motdePasse} = req.body;
        const admin =  await Admin.findOne({email, isActive:true});
        // verifier si l'admin exsite
        if(!admin) {
            return res.status(401).json({
        success:false,
        message:'Admin non trouvé'
          });
        }
        // verifier si le mot de passe est correct
        const isPasswordValid = await admin.comparePassword(motdePasse);
        if(!isPasswordValid){
            return res.status(401).json({
                success:false,
                message:'Mot de passe incorrect'
            })
        }
        // mettre a jour la date de derniere connexion
        admin.lastLogin = Date.now();
        await admin.save();

        // generer un token jwt
        const token = jwt.sign({
            adminId: admin._id,
            email: admin.email,
            role: admin.role
        },
        process.env.JWT_SECRET,{
            expiresIn:'2h'  // temps d'expiration de la session
        }
    );
    res.json({
        success:true,
        message:'Admin connecté avec succes',
        token,
        admin:{
            id:admin._id,
            nom:admin.nom,
            email:admin.email,
            role:admin.role
        }
    });
    }catch(error){
        console.error('Erreur de connexion:',error);
        res.status(500).json({
            success:false,
            message:'Erreur de connexion'
        });
    }
};
exports.createFirstAdmin = async (req, res) => {
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount > 0) {
        return res.status(403).json({
          success: false,
          message: 'Admin déjà existant'
        });
      }
  
      const admin = new Admin({
        nom: req.body.nom,
        email: req.body.email,
        motdePasse: req.body.motdePasse,
        role: 'super_admin'
      });
  
      await admin.save();
  
      res.status(201).json({
        success: true,
        message: 'Premier admin créé avec succès'
      });
  
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };