// middleware/auth.js - Backend Node.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Client Supabase avec service role pour vérifier les tokens
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'authentification manquant' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token JWT Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.error('Token invalide:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }

    // Récupérer le profil complet depuis Supabase
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Ajouter les infos utilisateur à req pour les utiliser dans les contrôleurs
    req.user = {
      id: user.id,
      email: user.email,
      nom: profile?.nom || user.user_metadata?.nom,
      prenom: profile?.prenom || user.user_metadata?.prenom,
    //   phone: profile?.phone || user.user_metadata?.phone,
      profile: profile,
      emailConfirmed: !!user.email_confirmed_at
    };
    
    next();
    
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Erreur d\'authentification' 
    });
  }
};

module.exports = { authenticateToken };