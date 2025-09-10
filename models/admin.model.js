const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// schema de admin
const adminSchema = new mongoose.Schema({
    nom:{type:String, required: true},
    email:{type:String, required:true,unique:true},
    motdePasse:{type:String,required:true},
    role:{type:String,
        enum:['admin','moderator','super_admin'],
        default:'admin'
    },
    isActive:{type:Boolean,default:true},
    lastLogin:{type:Date,default:Date.now},
    createdAt:{type:Date,default:Date.now}
});
// hash de mot de passe

adminSchema.pre('save',async function(next){
    if(!this.isModified('motdePasse')) return next();
    this.motdePasse = await bcrypt.hash(this.motdePasse,12);
    next();
});

// comparer le mot de passe 
adminSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.motdePasse);
};
module.exports = mongoose.model('Admin',adminSchema);