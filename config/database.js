require ('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
            
        });
        console.log('connecter a la base de données MongoDB');
    }catch(err){
        console.error('Erreur de connexion à MongoDB : ',err);
        process.exit(1);
    }
};
module.exports = connectDB;