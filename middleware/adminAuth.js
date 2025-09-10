const jwt =require('jsonwebtoken');
const Admin = require('../models/admin.model');

const authenticateAdmin = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader ||!authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: 'Token admin manquant'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // verifier si admin existe toujours et est actif
        const admin = await Admin.findById(decoded.adminId);
        if(!admin || !admin.isActive){
            return res.status(401).json({
                success:false,
                message:'Admin non autorisé'
            });
        }
        req.admin = admin;
        next();

    }catch(error){
        res.status(401).json({
            success:false,
            message:'token admin invalide'
        });
    }
};
// midelware pour vérifier le role admin
const requireRole = (roles)=>{
    return (req,res,next)=>{
        if(!req.admin || !roles.includes(req.admin.role)){
                return res.status(403).json({
                    success:false,
                    message:'Role insufisant'
                });
        }
        next();
    };
};
module.exports = {authenticateAdmin, requireRole};